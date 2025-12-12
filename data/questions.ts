import { Question } from '../types';

export const questions: Question[] = [
  // Tier 1 (Easy) - Domain 1 (Total: 6)
  {
    id: "q1",
    text: "A startup is migrating a monolithic e-commerce application to Google Cloud. The application has variable traffic with peaks during sales events. Leadership wants to reduce operational overhead while maintaining automatic scaling. Which GCP compute services provide automatic scaling and minimal operations? (Choose 2)",
    options: [
      { id: "a", label: "A", text: "Managed instance groups with startup scripts" },
      { id: "b", label: "B", text: "Google Kubernetes Engine (Autopilot)" },
      { id: "c", label: "C", text: "Google Dataproc" },
      { id: "d", label: "D", text: "Google App Engine Standard" }
    ],
    correctAnswerId: ["b", "d"],
    difficulty: 1,
    domain: "Designing and Planning",
    explanation: "GKE (especially Autopilot) and App Engine Standard provide fully managed autoscaling with minimal ops. MIGs require OS management; Dataproc is for data processing."
  },
  {
    id: "q2",
    text: "A multinational company is migrating to Google Cloud. Each country has its own projects, but management wants integrated networking while maintaining project independence. How should you organize networking?",
    options: [
      { id: "a", label: "A", text: "Peered VPC" },
      { id: "b", label: "B", text: "Cloud Interconnect" },
      { id: "c", label: "C", text: "Shared VPC" },
      { id: "d", label: "D", text: "Cloud VPN and Cloud Router" }
    ],
    correctAnswerId: "c",
    difficulty: 1,
    domain: "Designing and Planning",
    explanation: "Shared VPC creates a single global VPC managed centrally (host project) while service projects maintain independence."
  },
  {
    id: "q3",
    text: "Your company plans to migrate a multi-petabyte dataset to the cloud. The data must be available 24/7 and analysts only know SQL. How should you store the data?",
    options: [
      { id: "a", label: "A", text: "Load data into Google BigQuery" },
      { id: "b", label: "B", text: "Insert data into Google Cloud SQL" },
      { id: "c", label: "C", text: "Put flat files into Google Cloud Storage" },
      { id: "d", label: "D", text: "Stream data into Google Cloud Datastore" }
    ],
    correctAnswerId: "a",
    difficulty: 1,
    domain: "Designing and Planning",
    explanation: "BigQuery is a serverless, petabyte-scale data warehouse with standard SQL interface. Cloud SQL doesn't scale to petabytes."
  },
  {
    id: "q4",
    text: "You're using a single Cloud SQL instance and need to introduce high availability. What should you do?",
    options: [
      { id: "a", label: "A", text: "Create a read replica in a different region" },
      { id: "b", label: "B", text: "Create a failover replica in the same region but different zone" },
      { id: "c", label: "C", text: "Enable automatic backups and binary logging" },
      { id: "d", label: "D", text: "Migrate to Cloud Spanner" }
    ],
    correctAnswerId: "b",
    difficulty: 1,
    domain: "Designing and Planning",
    explanation: "Cloud SQL HA uses synchronous replication to a failover replica in a different zone within the same region."
  },
  {
    id: "q5",
    text: "Your company has reserved a monthly budget. You want automatic notification when approaching the limit. What should you do?",
    options: [
      { id: "a", label: "A", text: "Link a credit card with a monthly limit" },
      { id: "b", label: "B", text: "Create budget alerts for 50%, 90%, and 100% of budget" },
      { id: "c", label: "C", text: "Set a daily budget in App Engine Settings" },
      { id: "d", label: "D", text: "Configure billing export to BigQuery" }
    ],
    correctAnswerId: "b",
    difficulty: 1,
    domain: "Designing and Planning",
    explanation: "Budget alerts proactively warn at configured thresholds via email or Pub/Sub."
  },
  {
    id: "q1_extra",
    text: "You need to store objects that are accessed once a month for reporting. Availability is critical, but cost should be minimized. Which Storage class is best?",
    options: [
      { id: "a", label: "A", text: "Standard Storage" },
      { id: "b", label: "B", text: "Nearline Storage" },
      { id: "c", label: "C", text: "Coldline Storage" },
      { id: "d", label: "D", text: "Archive Storage" }
    ],
    correctAnswerId: "b",
    difficulty: 1,
    domain: "Designing and Planning",
    explanation: "Nearline is optimized for data accessed less than once a month. Coldline is for once a quarter."
  },

  // Tier 2 (Medium) - Domain 2 & 3 (Total: 7)
  {
    id: "q6",
    text: "A mobile game needs near-continuous availability, low latency globally, and quick scaling. The backend exposes HTTP REST APIs. How should you design the backend?",
    options: [
      { id: "a", label: "A", text: "Layer 4 TCP Load Balancer, MIGs in one zone" },
      { id: "b", label: "B", text: "Layer 7 HTTPS Load Balancer, MIGs in one zone" },
      { id: "c", label: "C", text: "Layer 7 HTTPS Load Balancer, MIGs in multiple regions" },
      { id: "d", label: "D", text: "Layer 4 TCP Load Balancer, MIGs across multiple zones" }
    ],
    correctAnswerId: "c",
    difficulty: 2,
    domain: "Designing and Planning",
    explanation: "Global HTTPS load balancer uses anycast to route users to nearest healthy backend. Multi-zone MIGs in multiple regions eliminate single points of failure."
  },
  {
    id: "q7",
    text: "Which three practices should you recommend for migrating a J2EE application? (Choose 3)",
    options: [
      { id: "a", label: "A", text: "Port application code to App Engine" },
      { id: "b", label: "B", text: "Integrate Cloud Dataflow for real-time metrics" },
      { id: "c", label: "C", text: "Instrument with Cloud Operations monitoring" },
      { id: "d", label: "D", text: "Select an automation framework (IaC)" },
      { id: "e", label: "E", text: "Deploy CI/CD with automated testing in staging" },
      { id: "f", label: "F", text: "Migrate from MySQL to NoSQL" }
    ],
    correctAnswerId: ["c", "d", "e"],
    difficulty: 2,
    domain: "Managing Implementation",
    explanation: "Monitoring, Infrastructure as Code, and CI/CD are universal migration best practices."
  },
  {
    id: "q8",
    text: "A latency-sensitive service needs to scale from 8 to 160 instances quickly. What minimizes startup time?",
    options: [
      { id: "a", label: "A", text: "Use Cloud OS Config to install packages after start" },
      { id: "b", label: "B", text: "Build a custom image with all packages" },
      { id: "c", label: "C", text: "Use Terraform with startup scripts" },
      { id: "d", label: "D", text: "Use Puppet to configure instances after creation" }
    ],
    correctAnswerId: "b",
    difficulty: 2,
    domain: "Managing and Provisioning",
    explanation: "Prebaking packages into a custom image eliminates installation time at boot."
  },
  {
    id: "q9",
    text: "You need to change your GKE cluster's machine type from n1-standard-1 to n1-standard-4. What should you do?",
    options: [
      { id: "a", label: "A", text: "Create a new node pool and migrate workloads" },
      { id: "b", label: "B", text: "gcloud container clusters resize" },
      { id: "c", label: "C", text: "gcloud container clusters update" },
      { id: "d", label: "D", text: "gcloud container clusters migrate" }
    ],
    correctAnswerId: "a",
    difficulty: 3,
    domain: "Managing and Provisioning",
    explanation: "Machine types cannot be changed for existing node pools. You must create a new node pool."
  },
  {
    id: "q10",
    text: "Videos should move to Coldline after 90 days and delete after one year. How should you set up the policy?",
    options: [
      { id: "a", label: "A", text: "Create a Cloud Function to move/delete" },
      { id: "b", label: "B", text: "Use versioning with lifecycle rules" },
      { id: "c", label: "C", text: "Create lifecycle rules: transition 90d, delete 365d" },
      { id: "d", label: "D", text: "Use Cloud Scheduler daily jobs" }
    ],
    correctAnswerId: "c",
    difficulty: 3,
    domain: "Managing and Provisioning",
    explanation: "Declarative lifecycle rules handle time-based transitions natively."
  },
  {
    id: "q14",
    text: "A company behind a Global HTTPS Load Balancer needs defense against DDoS attacks. Which service should they implement?",
    options: [
      { id: "a", label: "A", text: "Cloud Identity-Aware Proxy" },
      { id: "b", label: "B", text: "VPC Firewall Rules" },
      { id: "c", label: "C", text: "Cloud Armor" },
      { id: "d", label: "D", text: "IAM Policies" }
    ],
    correctAnswerId: "c",
    difficulty: 3,
    domain: "Security and Compliance",
    explanation: "Cloud Armor provides DDoS protection, WAF rules, and bot management at Google's network edge."
  },
  {
    id: "q2_extra",
    text: "You are designing a stateless microservice that requires rapid scaling (up to 1000 instances) and processes asynchronous tasks from Pub/Sub. Which compute option is most cost-effective and efficient?",
    options: [
      { id: "a", label: "A", text: "Google Kubernetes Engine" },
      { id: "b", label: "B", text: "Cloud Run" },
      { id: "c", label: "C", text: "Compute Engine" },
      { id: "d", label: "D", text: "App Engine Flexible" }
    ],
    correctAnswerId: "b",
    difficulty: 3,
    domain: "Designing and Planning",
    explanation: "Cloud Run scales to zero and handles rapid burst scaling for stateless containers perfectly, often more cheaply than GKE for this use case."
  },

  // Tier 3 (Hard) - Security & SRE (Total: 5)
  {
    id: "q17",
    text: "MountKirk Games uses GKE and needs secure, standards-based access to GCP APIs without vendor lock-in. Which solution do you recommend?",
    options: [
      { id: "a", label: "A", text: "API keys" },
      { id: "b", label: "B", text: "Service Accounts" },
      { id: "c", label: "C", text: "Workload Identity" },
      { id: "d", label: "D", text: "Workload Identity Federation" }
    ],
    correctAnswerId: "c",
    difficulty: 4,
    domain: "Security and Compliance",
    explanation: "Workload Identity is Google's recommended method for GKE pods to access GCP APIs securely."
  },
  {
    id: "q27",
    text: "You need to automatically build and deploy containerized applications when code is pushed to main. Which combination is recommended?",
    options: [
      { id: "a", label: "A", text: "Source Repos, Cloud Build, Container Registry, Cloud Deploy" },
      { id: "b", label: "B", text: "GitHub, Jenkins on GCE, Docker Hub, kubectl" },
      { id: "c", label: "C", text: "Source Repos, Cloud Composer, Artifact Registry, Cloud Run" },
      { id: "d", label: "D", text: "Bitbucket, Cloud Functions, Cloud Storage, App Engine" }
    ],
    correctAnswerId: "a",
    difficulty: 4,
    domain: "Managing Implementation",
    explanation: "This is Google's recommended CI/CD stack. Cloud Deploy manages releases specifically."
  },
  {
    id: "q33",
    text: "Your SRE team needs 99.9% availability. Which correctly describes the relationship between SLI, SLO, and error budget?",
    options: [
      { id: "a", label: "A", text: "SLI measures latency; SLO is contract" },
      { id: "b", label: "B", text: "SLI is metric; SLO is target; Error budget is 100%-SLO" },
      { id: "c", label: "C", text: "SLA is internal; SLO is customer-facing" },
      { id: "d", label: "D", text: "Error budget is maximum uptime" }
    ],
    correctAnswerId: "b",
    difficulty: 5,
    domain: "Ensuring Reliability",
    explanation: "SLI is the measured metric; SLO is the target; error budget is the acceptable failure rate (100% - SLO)."
  },
  {
    id: "q41",
    text: "For HIPAA compliance on Google Cloud, which two actions are required? (Choose 2)",
    options: [
      { id: "a", label: "A", text: "Verify services against HIPAA-compliant product list" },
      { id: "b", label: "B", text: "Execute a Business Associate Agreement (BAA)" },
      { id: "c", label: "C", text: "Use only public IP addresses" },
      { id: "d", label: "D", text: "Store all data in single region" }
    ],
    correctAnswerId: ["a", "b"],
    difficulty: 5,
    domain: "Security and Compliance",
    explanation: "Not all GCP services are HIPAA-compliant. A BAA is legally required for handling PHI."
  },
  {
    id: "q3_extra",
    text: "You need to restrict a specific GCP project so it can only communicate with APIs in North America. You also need to prevent data exfiltration to external storage buckets. What should you use?",
    options: [
      { id: "a", label: "A", text: "VPC Firewall Rules" },
      { id: "b", label: "B", text: "VPC Service Controls" },
      { id: "c", label: "C", text: "Cloud Armor" },
      { id: "d", label: "D", text: "IAM Conditions" }
    ],
    correctAnswerId: "b",
    difficulty: 5,
    domain: "Security and Compliance",
    explanation: "VPC Service Controls allow you to define a service perimeter to control data egress and restrict API access locations."
  }
];
