# Hybrid Switch Modernization Platform

A payment switching simulation that models transaction routing, issuer authorization, payment resiliency, and event-driven processing patterns commonly found in ATM, POS, and debit network environments.

The platform was built to explore how modern payment switches handle transaction authorization, active-active processing, issuer outages, stand-in decisions, settlement generation, and downstream event distribution.

## Key Capabilities

### Transaction Processing

- Purchase transactions
- ATM cash withdrawals
- ATM balance inquiries
- PIN validation
- Issuer routing based on BIN ranges
- Authorization and decline handling

### Payment Resiliency

- Active-active switch node processing
- Node health monitoring
- Automatic failover between switch nodes
- Issuer timeout simulation
- Retry handling for transient failures
- Stand-in processing for issuer outages
- Post-authorization reversal generation

### Event-Driven Architecture

The platform publishes domain events for downstream processing:

- Authorization Events
- Fraud Events
- Settlement Events
- Analytics Events
- Reversal Events

Events are mapped to logical topics and consumed by simulated downstream services to demonstrate asynchronous processing patterns.

## High Level Flow

```text
Cardholder Transaction
        ↓
Scenario Resolution
        ↓
Switch Node Selection
        ↓
Issuer Routing
        ↓
PIN Validation
        ↓
Authorization
        ↓
Event Publishing
        ↓
Consumer Processing
```

## Example Scenarios

### Purchase Transaction

```text
POS Transaction
      ↓
Authorization
      ↓
Settlement Event
      ↓
Analytics Event
```

### Issuer Timeout

```text
Authorization Request
      ↓
Issuer Timeout
      ↓
Retry Attempts
      ↓
Stand-In Processing
      ↓
Approve or Decline
```

### Post Authorization Failure

```text
Authorization Approved
      ↓
Operational Failure
      ↓
Reversal Event Generated
```

## Architecture Concepts Demonstrated

- Payment switch modernization
- Active-active processing
- Event-driven architecture
- Topic-based event distribution
- Consumer-driven processing
- Payment resiliency patterns
- Transaction lifecycle management
- ATM and POS transaction flows
- Authorization and settlement separation
- Stand-in authorization strategies

## Topic and Consumer Model

```text
AUTHORIZATION_EVENT
        ↓
authorization-events
        ↓
Authorization Consumer

FRAUD_EVENT
        ↓
fraud-events
        ↓
Fraud Consumer

SETTLEMENT_EVENT
        ↓
settlement-events
        ↓
Settlement Consumer

ANALYTICS_EVENT
        ↓
analytics-events
        ↓
Analytics Consumer

REVERSAL_EVENT
        ↓
reversal-events
        ↓
Reversal Consumer
```

## Future Enhancements

- External message broker integration
- Persistent event storage
- Consumer groups
- Dead letter queues
- Settlement reconciliation engine
- Transaction monitoring dashboard
- Real-time metrics and reporting
- Multi-issuer routing support

## Technology Stack

- Node.js
- Express
- REST APIs
- Event-driven processing model
- In-memory transaction store

## Purpose

This project was created as a practical exploration of payment switch architecture, transaction routing, resiliency patterns, and event-driven processing commonly used in modern banking and payment ecosystems.