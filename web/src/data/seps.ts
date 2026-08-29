/**
 * The four Stellar Ecosystem Proposals MACH composes into a settlement path.
 *
 * `status` is deliberately explicit. SEP-38 is a stable, ratified standard;
 * SEP-45 is an accepted draft; the account-provisioning and vault standards
 * MACH targets are still moving. Reviewers are protocol specialists — labelling
 * a proposal as final is a faster way to lose credibility than admitting it is
 * a draft we are building against.
 */
export type SepStatus = "STABLE" | "DRAFT" | "PROPOSED";

export interface SepEntry {
  /** Numeric identifier, rendered as the plate index. */
  id: string;
  /** Canonical standard name. */
  name: string;
  /** The role this standard plays inside MACH specifically. */
  role: string;
  /** One-paragraph explanation of why MACH depends on it. */
  description: string;
  status: SepStatus;
  /** The concrete surface MACH integrates against. */
  surface: string;
}

export const SEPS: SepEntry[] = [
  {
    id: "59",
    name: "External Account Server",
    role: "Virtual Account Provisioning & Webhook Oracle",
    description:
      "Provisions a unique receiving instrument — a virtual IBAN or local rail account — bound to a single smart invoice. The anchor signs a payment notification the moment fiat lands, turning a bank credit into a verifiable on-chain event.",
    status: "PROPOSED",
    surface: "EXTERNAL_ACCOUNT_SERVER · on_change_callback",
  },
  {
    id: "38",
    name: "Anchor RFQ API",
    role: "Firm Quotes for Cross-Asset Liquidity",
    description:
      "Supplies a firm, time-bound quote before settlement executes, so an invoice denominated in one currency can be discharged in another without exposing the lender to slippage between notification and execution.",
    status: "STABLE",
    surface: "GET /prices · POST /quote",
  },
  {
    id: "45",
    name: "Web Authentication for Contract Accounts",
    role: "Smart Contract Account (C-Address) Identity",
    description:
      "Authenticates the business as a contract account rather than a classic keypair. Signing policy lives inside the account contract, which means keys can rotate without the invoice ever changing owner.",
    status: "DRAFT",
    surface: "C-address challenge · signature policy",
  },
  {
    id: "56",
    name: "Tokenized Vault Interface",
    role: "Tokenized Vaults for Institutional Lenders",
    description:
      "Standardises the deposit and redemption surface a lender interacts with, so capital pooled against a book of invoices is represented by a fungible claim with predictable accounting.",
    status: "PROPOSED",
    surface: "deposit · redeem · convert_to_assets",
  },
];
