import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

/**
 * Custom hooks for easy Convex data access
 */

// ========== LEADS ==========

export function useLeads() {
  return useQuery(api.functions.leads.list);
}

export function useLead(leadId) {
  return useQuery(api.functions.leads.get, leadId ? { leadId } : 'skip');
}

export function useCreateLead() {
  return useMutation(api.functions.leads.create);
}

export function useUpdateLead() {
  return useMutation(api.functions.leads.update);
}

export function useDeleteLead() {
  return useMutation(api.functions.leads.remove);
}

// ========== PROPOSALS ==========

export function useProposals() {
  return useQuery(api.functions.proposals.list);
}

export function useProposal(proposalId) {
  return useQuery(api.functions.proposals.get, proposalId ? { proposalId } : 'skip');
}

export function useCreateProposal() {
  return useMutation(api.functions.proposals.create);
}

export function useUpdateProposal() {
  return useMutation(api.functions.proposals.update);
}

export function useMarkProposalAsSent() {
  return useMutation(api.functions.proposals.markAsSent);
}

export function useMarkProposalAsAccepted() {
  return useMutation(api.functions.proposals.markAsAccepted);
}

// ========== WORK ORDERS ==========

export function useWorkOrders() {
  return useQuery(api.functions.workOrders.list);
}

export function useWorkOrder(workOrderId) {
  return useQuery(api.functions.workOrders.get, workOrderId ? { workOrderId } : 'skip');
}

export function useCreateWorkOrder() {
  return useMutation(api.functions.workOrders.create);
}

export function useUpdateWorkOrder() {
  return useMutation(api.functions.workOrders.update);
}

export function useMarkWorkOrderAsCompleted() {
  return useMutation(api.functions.workOrders.markAsCompleted);
}

// ========== INVOICES ==========

export function useInvoices() {
  return useQuery(api.functions.invoices.list);
}

export function useInvoice(invoiceId) {
  return useQuery(api.functions.invoices.get, invoiceId ? { invoiceId } : 'skip');
}

export function useCreateInvoice() {
  return useMutation(api.functions.invoices.create);
}

export function useUpdateInvoice() {
  return useMutation(api.functions.invoices.update);
}

export function useMarkInvoiceAsPaid() {
  return useMutation(api.functions.invoices.markAsPaid);
}

export function useOverdueInvoices() {
  return useQuery(api.functions.invoices.listOverdue);
}

// ========== CUSTOMERS ==========

export function useCustomers() {
  return useQuery(api.functions.customers.list);
}

export function useCustomer(customerId) {
  return useQuery(api.functions.customers.get, customerId ? { customerId } : 'skip');
}

export function useCreateCustomer() {
  return useMutation(api.functions.customers.create);
}

export function useUpdateCustomer() {
  return useMutation(api.functions.customers.update);
}

export function useSearchCustomers(query) {
  return useQuery(api.functions.customers.search, query ? { query } : 'skip');
}

// ========== USERS ==========

export function useCurrentUser() {
  return useQuery(api.functions.users.getCurrent);
}

export function useUsers() {
  return useQuery(api.functions.users.list);
}

export function useOrganization() {
  return useQuery(api.functions.organizations.getCurrent);
}

// ========== ONBOARDING ==========

export function useSetupNewUser() {
  return useMutation(api.functions.onboarding.setupNewUser);
}
