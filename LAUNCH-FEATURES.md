# CivIQ: Launch-Critical Features & Tech Stack

## **Goal**
Ensure CivIQ launches with **essential identity verification, moderation, and ranking features**, while keeping the system **scalable, bot-resistant, and user-friendly.**

---

## **🚀 MVP Features (Launch-Critical)**

### **1️⃣ Identity Verification & Bot Prevention**
| Feature | Why It’s Needed | Technology Stack |
|---------|---------------|------------------|
| **FingerprintJS (Browser Fingerprinting)** | Stops easy bot/multi-account creation | **FingerprintJS API** |
| **Basic Device Binding (LocalStorage + Fingerprint Hashing)** | Prevents casual multi-accounting | **LocalStorage + FingerprintJS + Redis** |
| **IP Address Rate-Limiting** | Stops multiple signups from same IP | **Redis + Fastify Rate-Limit** |
| **Email Reputation Scoring (Kickbox API)** | Blocks mass spam emails & temporary addresses | **Kickbox API + PostgreSQL** |

---

### **2️⃣ Core Platform Features**
| Feature | Why It’s Needed | Technology Stack |
|---------|---------------|------------------|
| **Backend API** | Handles user authentication, posts, and moderation | **Fastify (Node.js) + PostgreSQL** |
| **Frontend UI** | Provides an intuitive, responsive user experience | **Next.js + TailwindCSS** |
| **Content Ranking Algorithm** | Ensures quality discourse, prevents engagement-driven virality | **Weaviate (Vector Search Engine)** |
| **User Profiles & Reputation System** | Builds long-term trust and influence metrics | **PostgreSQL + Redis** |
| **Basic Moderation System** | Includes flagging, nested comments, and reporting tools | **Fastify API + PostgreSQL** |
| **Intelligent Toxicity Prevention** | Detects **contextual toxicity**, prevents brigading/spamming, and rewards constructive users | **Regex (Context Filtering) + Redis Rate-Limiting + PostgreSQL Reputation System** |

---

## **3️⃣ MVP Tech Stack**

### **🔹 Moderation Tech Stack**
| **Feature** | **Technology** | **Why It’s Used?** |
|------------|--------------|------------------|
| **Pattern-Based Filtering (Regex + Context Awareness)** | **Regex (Native in Node.js)** | ✅ Fast, lightweight, and prevents blanket censorship |
| **Rate-Limiting for Aggressive Behavior** | **Redis + Fastify Rate-Limit** | ✅ Stops spam, brigading, and harassment waves |
| **User Reputation & Trust Score** | **PostgreSQL (Custom Scoring System)** | ✅ Encourages constructive discussion & limits toxic users |

### **🔹 User Profile & Basic Moderation Tech Stack**
| **Feature** | **Technology** | **Why It’s Used?** |
|------------|--------------|------------------|
| **User Profiles & Reputation System** | **PostgreSQL + Redis** | ✅ Stores user trust scores and engagement history efficiently |
| **Profile UI Components** | **Next.js + TailwindCSS** | ✅ Ensures a clean, responsive profile design |
| **Comment Moderation System** | **Fastify API + PostgreSQL** | ✅ Enables structured flagging, nested comments, and reporting tools |
| **Profile Privacy & Visibility Settings** | **Custom PostgreSQL Schema + Access Control Middleware** | ✅ Gives users control over their profile exposure |

---

## **📌 Next Steps**
1️⃣ **Implement FingerprintJS, IP Rate-Limiting, and Email Reputation Scoring first.**  
2️⃣ **Set up database and backend for user identity enforcement.**  
3️⃣ **Integrate intelligent toxicity prevention using pattern-based filtering, behavioral rate-limiting, and user reputation scoring.**  
4️⃣ **Build user profile system with reputation tracking and moderation tools.**  

🔥 **This ensures CivIQ is bot-resistant and minimizes toxicity at launch while allowing for stronger verification and moderation features post-launch.**