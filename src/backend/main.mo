import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  module Client {
    public type T = {
      id : Nat;
      name : Text;
      company : Text;
      phone : Text;
      email : Text;
      address : Text;
      notes : Text;
      createdAt : Int;
      updatedAt : Int;
      createdBy : Principal;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module ClientInteraction {
    public type Status = {
      #open;
      #inProgress;
      #closed;
      #won;
      #lost;
    };

    public type T = {
      id : Nat;
      clientId : Nat;
      type_ : Text;
      title : Text;
      description : Text;
      status : Status;
      amount : ?Nat;
      date : Int;
      createdBy : Principal;
      updatedAt : Int;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module Claim {
    public type Status = {
      #pending;
      #approved;
      #rejected;
    };

    public type T = {
      id : Nat;
      userId : Principal;
      date : Int;
      travelAllowance : Nat;
      dailyAllowance : Nat;
      locationsVisited : Text;
      notes : Text;
      submittedAt : Int;
      status : Status;
      adminRemarks : Text;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module VisitLog {
    public type Status = {
      #planned;
      #completed;
      #cancelled;
    };

    public type T = {
      id : Nat;
      userId : Principal;
      clientId : Nat;
      plannedDate : Int;
      purpose : Text;
      status : Status;
      completionNotes : Text;
      completedAt : Int;
    };

    public func compare(a : T, b : T) : Order.Order {
      Nat.compare(a.id, b.id);
    };
  };

  module UserProfile {
    public type T = {
      name : Text;
      createdAt : Int;
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let clients = Map.empty<Nat, Client.T>();
  let interactions = Map.empty<Nat, ClientInteraction.T>();
  let claims = Map.empty<Nat, Claim.T>();
  let visits = Map.empty<Nat, VisitLog.T>();
  let userProfiles = Map.empty<Principal, UserProfile.T>();

  var clientIdCounter = 0;
  var interactionIdCounter = 0;
  var claimIdCounter = 0;
  var visitIdCounter = 0;

  // User Profile Management
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, {
      profile with
      createdAt = Time.now();
    });
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile.T {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Client Management
  public shared ({ caller }) func createClient(client : Client.T) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can create clients");
    };

    let currentTime = Time.now();
    let id = clientIdCounter;

    let newClient = {
      id = id;
      name = client.name;
      company = client.company;
      phone = client.phone;
      email = client.email;
      address = client.address;
      notes = client.notes;
      createdAt = currentTime;
      updatedAt = currentTime;
      createdBy = caller;
    };

    clients.add(id, newClient);
    clientIdCounter += 1;
    id;
  };

  public shared ({ caller }) func updateClient(id : Nat, client : Client.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can update clients");
    };

    switch (clients.get(id)) {
      case null {
        Runtime.trap("Client not found");
      };
      case (?existingClient) {
        if (existingClient.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update this client");
        };

        let updatedClient = {
          id = id;
          name = client.name;
          company = client.company;
          phone = client.phone;
          email = client.email;
          address = client.address;
          notes = client.notes;
          createdAt = existingClient.createdAt;
          updatedAt = Time.now();
          createdBy = existingClient.createdBy;
        };

        clients.add(id, updatedClient);
      };
    };
  };

  public shared ({ caller }) func deleteClient(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can delete clients");
    };

    switch (clients.get(id)) {
      case null {
        Runtime.trap("Client not found");
      };
      case (?existingClient) {
        if (existingClient.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can delete this client");
        };

        clients.remove(id);
      };
    };
  };

  // Bulk delete all clients (admin only) - much faster than deleting one by one
  public shared ({ caller }) func deleteAllClients() : async Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      // Also allow regular users to delete their own clients in bulk
      let myIds = clients.entries().toArray().filter(func(entry) { entry.1.createdBy == caller });
      for (entry in myIds.vals()) {
        clients.remove(entry.0);
      };
      return myIds.size();
    };
    // Admin: delete all
    let allIds = clients.keys().toArray();
    for (id in allIds.vals()) {
      clients.remove(id);
    };
    allIds.size();
  };

  public query ({ caller }) func getClient(id : Nat) : async ?Client.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve clients");
    };
    clients.get(id);
  };

  public query ({ caller }) func getAllClients() : async [Client.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve clients");
    };
    clients.values().toArray().sort();
  };

  // Client Interaction Management
  public shared ({ caller }) func createInteraction(interaction : ClientInteraction.T) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can create interactions");
    };

    let id = interactionIdCounter;
    let currentTime = Time.now();

    let newInteraction = {
      id = id;
      clientId = interaction.clientId;
      type_ = interaction.type_;
      title = interaction.title;
      description = interaction.description;
      status = interaction.status;
      amount = interaction.amount;
      date = currentTime;
      createdBy = caller;
      updatedAt = currentTime;
    };

    interactions.add(id, newInteraction);
    interactionIdCounter += 1;
    id;
  };

  public shared ({ caller }) func updateInteraction(id : Nat, interaction : ClientInteraction.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can update interactions");
    };

    switch (interactions.get(id)) {
      case null {
        Runtime.trap("Interaction not found");
      };
      case (?existingInteraction) {
        if (existingInteraction.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update this interaction");
        };

        let updatedInteraction = {
          id = id;
          clientId = interaction.clientId;
          type_ = interaction.type_;
          title = interaction.title;
          description = interaction.description;
          status = interaction.status;
          amount = interaction.amount;
          date = existingInteraction.date;
          createdBy = existingInteraction.createdBy;
          updatedAt = Time.now();
        };

        interactions.add(id, updatedInteraction);
      };
    };
  };

  public shared ({ caller }) func deleteInteraction(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized users can delete interactions");
    };

    switch (interactions.get(id)) {
      case null {
        Runtime.trap("Interaction not found");
      };
      case (?existingInteraction) {
        if (existingInteraction.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can delete this interaction");
        };

        interactions.remove(id);
      };
    };
  };

  public query ({ caller }) func getInteraction(id : Nat) : async ?ClientInteraction.T {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve interactions");
    };
    interactions.get(id);
  };

  public query ({ caller }) func getAllInteractions() : async [ClientInteraction.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve interactions");
    };
    interactions.values().toArray().sort();
  };

  // TA DA Claims Management
  public shared ({ caller }) func submitClaim(claimInput : Claim.T) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit claims");
    };

    let id = claimIdCounter;

    let newClaim = {
      id = id;
      userId = caller;
      date = claimInput.date;
      travelAllowance = claimInput.travelAllowance;
      dailyAllowance = claimInput.dailyAllowance;
      locationsVisited = claimInput.locationsVisited;
      notes = claimInput.notes;
      submittedAt = Time.now();
      status = #pending;
      adminRemarks = "";
    };

    claims.add(id, newClaim);
    claimIdCounter += 1;
    id;
  };

  public shared ({ caller }) func approveClaim(id : Nat, remarks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can approve claims");
    };

    switch (claims.get(id)) {
      case null {
        Runtime.trap("Claim not found");
      };
      case (?existingClaim) {
        let updatedClaim = {
          existingClaim with
          status = #approved;
          adminRemarks = remarks;
        };
        claims.add(id, updatedClaim);
      };
    };
  };

  public shared ({ caller }) func rejectClaim(id : Nat, remarks : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject claims");
    };

    switch (claims.get(id)) {
      case null {
        Runtime.trap("Claim not found");
      };
      case (?existingClaim) {
        let updatedClaim = {
          existingClaim with
          status = #rejected;
          adminRemarks = remarks;
        };
        claims.add(id, updatedClaim);
      };
    };
  };

  public query ({ caller }) func getClaimsForCaller() : async [Claim.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve claims");
    };

    claims.values().toArray().filter(func(claim) { claim.userId == caller }).sort();
  };

  public query ({ caller }) func getAllClaims() : async [Claim.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can retrieve all claims");
    };

    claims.values().toArray().sort();
  };

  // Visit Log Management
  public shared ({ caller }) func createVisitLog(visit : VisitLog.T) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create visit logs");
    };

    let id = visitIdCounter;

    let newVisit = {
      id = id;
      userId = caller;
      clientId = visit.clientId;
      plannedDate = visit.plannedDate;
      purpose = visit.purpose;
      status = visit.status;
      completionNotes = visit.completionNotes;
      completedAt = visit.completedAt;
    };

    visits.add(id, newVisit);
    visitIdCounter += 1;
    id;
  };

  public shared ({ caller }) func updateVisitLog(id : Nat, visit : VisitLog.T) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update visit logs");
    };

    switch (visits.get(id)) {
      case null {
        Runtime.trap("Visit log not found");
      };
      case (?existingVisit) {
        if (existingVisit.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can update this visit log");
        };

        let updatedVisit = {
          id = id;
          userId = existingVisit.userId;
          clientId = visit.clientId;
          plannedDate = visit.plannedDate;
          purpose = visit.purpose;
          status = visit.status;
          completionNotes = visit.completionNotes;
          completedAt = visit.completedAt;
        };

        visits.add(id, updatedVisit);
      };
    };
  };

  public shared ({ caller }) func deleteVisitLog(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete visit logs");
    };

    switch (visits.get(id)) {
      case null {
        Runtime.trap("Visit log not found");
      };
      case (?existingVisit) {
        if (existingVisit.userId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the creator or admin can delete this visit log");
        };

        visits.remove(id);
      };
    };
  };

  public query ({ caller }) func getVisitsForCaller() : async [VisitLog.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve their visits");
    };

    visits.values().toArray().filter(func(visit) { visit.userId == caller }).sort();
  };

  public query ({ caller }) func getAllVisits() : async [VisitLog.T] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can retrieve all visits");
    };

    visits.values().toArray().sort();
  };

  // Reports
  public query ({ caller }) func getTotalClientsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve client count");
    };
    clients.size();
  };

  public query ({ caller }) func getInteractionsSummary() : async {
    open : Nat;
    inProgress : Nat;
    closed : Nat;
    won : Nat;
    lost : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve interaction summary");
    };

    var open = 0;
    var inProgress = 0;
    var closed = 0;
    var won = 0;
    var lost = 0;

    for (interaction in interactions.values()) {
      switch (interaction.status) {
        case (#open) { open += 1 };
        case (#inProgress) { inProgress += 1 };
        case (#closed) { closed += 1 };
        case (#won) { won += 1 };
        case (#lost) { lost += 1 };
      };
    };

    {
      open;
      inProgress;
      closed;
      won;
      lost;
    };
  };

  public query ({ caller }) func getClaimsSummaryPerStaff() : async [(Principal, { totalSubmitted : Nat; totalApprovedAmount : Nat })] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can retrieve claims summary");
    };

    let summaryMap = Map.empty<Principal, { totalSubmitted : Nat; totalApprovedAmount : Nat }>();

    for (claim in claims.values()) {
      let currentSummary = switch (summaryMap.get(claim.userId)) {
        case null { { totalSubmitted = 0; totalApprovedAmount = 0 } };
        case (?summary) { summary };
      };

      let approvedAmount = switch (claim.status) {
        case (#approved) { claim.travelAllowance + claim.dailyAllowance };
        case _ { 0 };
      };

      summaryMap.add(claim.userId, {
        totalSubmitted = currentSummary.totalSubmitted + 1;
        totalApprovedAmount = currentSummary.totalApprovedAmount + approvedAmount;
      });
    };

    summaryMap.entries().toArray();
  };

  public query ({ caller }) func getVisitLogsCountPerStaff() : async [(Principal, Nat)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can retrieve visit logs count");
    };

    let countMap = Map.empty<Principal, Nat>();

    for (visit in visits.values()) {
      let currentCount = switch (countMap.get(visit.userId)) {
        case null { 0 };
        case (?count) { count };
      };

      countMap.add(visit.userId, currentCount + 1);
    };

    countMap.entries().toArray();
  };

  public query ({ caller }) func getPipelineStats() : async {
    inquiry : Nat;
    offer : Nat;
    order : Nat;
    followup : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can retrieve pipeline stats");
    };

    var inquiry = 0;
    var offer = 0;
    var order = 0;
    var followup = 0;

    for (interaction in interactions.values()) {
      if (interaction.type_ == "inquiry") { inquiry += 1 };
      if (interaction.type_ == "offer") { offer += 1 };
      if (interaction.type_ == "order") { order += 1 };
      if (interaction.type_ == "followup") { followup += 1 };
    };

    {
      inquiry;
      offer;
      order;
      followup;
    };
  };
};
