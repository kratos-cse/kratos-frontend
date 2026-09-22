import { apiFetch } from "./client";

export function createTeam(eventId, name) {
  return apiFetch(`/events/${eventId}/teams`, {
    method: "POST",
    body: { name },
    auth: true,
  });
}

export function getTeam(teamId) {
  return apiFetch(`/teams/${teamId}`, { auth: true });
}

export function getTeamMembers(teamId) {
  return apiFetch(`/teams/${teamId}/members`, { auth: true });
}

export function updateTeam(teamId, payload) {
  return apiFetch(`/teams/${teamId}`, { method: "PATCH", body: payload, auth: true });
}

export function createInvitation(teamId) {
  return apiFetch(`/teams/${teamId}/invitations`, { method: "POST", auth: true });
}

export function getInvitation(inviteCode) {
  return apiFetch(`/team-invitations/${inviteCode}`);
}

export function joinInvitation(inviteCode) {
  return apiFetch(`/team-invitations/${inviteCode}/join`, { method: "POST", auth: true });
}

export function addRosterMember(teamId, payload) {
  return apiFetch(`/teams/${teamId}/roster`, {
    method: "POST",
    body: payload,
    auth: true,
  });
}

export function leaveTeam(teamId, memberId) {
  return apiFetch(`/teams/${teamId}/members/${memberId}/leave`, { method: "POST", auth: true });
}

export function removeMember(teamId, memberId) {
  return apiFetch(`/teams/${teamId}/members/${memberId}/remove`, { method: "POST", auth: true });
}
