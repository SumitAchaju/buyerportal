# 🛒 Buyer Portal

This project provides a **streamlined interface for managing buyer activities**.  
Follow the instructions below to get the environment up and running quickly.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v22 or higher recommended)
- **Docker & Docker Compose** (for containerized execution)
- **Git**

---

## 🚀 Running the Project

You can run this project using **Docker**, a **Windows Batch script**, or a **Shell script**.

---

## ✅ Option 1: Docker Compose (Recommended)

This is the easiest way to ensure all dependencies (Database, Backend, Frontend) are synchronized.

### Step 1 — Build and Start Containers

```bash
docker-compose up --build -d
```

This command will:

- Build all required images
- Start backend, frontend, and database services
- Run containers in detached mode

---

## 🪟 Option 2: Windows (run.bat)

Run the following command in PowerShell or Command Prompt:

```bash
.\run.bat
```

---

## 🐧 Option 3: Linux or macOS (run.sh)

Run the following command:

```bash
sh run.sh
```

---

## 🔗 Project Links

- **Link:** http://localhost

---

## 📌 Notes

- Make sure Docker is running before executing any commands.
- Use Docker Compose for the most consistent development environment.
- Scripts (`run.bat` / `run.sh`) automate environment setup.
- env file is added only for showcase dont misuse it

---

## 🧑‍💻 Development Workflow

1. Clone the repository
2. Navigate into the project directory
3. Run one of the setup options above
4. Open the application in your browser
