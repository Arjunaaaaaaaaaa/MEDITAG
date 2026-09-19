# MediTag

**MediTag** is a hackathon prototype for a digital health identity and medical-record system that helps patients and healthcare professionals access important medical information through a unique MediTag QR.

## Project Status

**Current stage: Review 1 Prototype**

The current version demonstrates the core MediTag workflow locally. Some components such as authentication, OTP delivery, database storage, AI assistance and production-level security are currently simulated or planned for future development.

---

## Problem

Patient medical information is often scattered across hospitals, clinics, paper reports and prescriptions.

This can make it difficult for healthcare professionals to quickly understand a patient's:

* Previous medical history
* Allergies
* Current medications
* Medical conditions
* Emergency information

Patients may also find it difficult to remember or explain their complete medical history and may not always understand medical advice after a consultation.

MediTag aims to make important patient information easier to access while providing a foundation for secure, patient-controlled medical records.

---

## Proposed Solution

MediTag provides each patient with a unique digital health identity and QR code.

The QR code contains only a **MediTag identifier/token**, not the patient's medical information.

The prototype demonstrates separate patient and doctor workflows:

**Patient → MediTag QR → Doctor/Clinician → Patient Record**

The long-term goal is to connect this workflow to a secure backend with verified authentication, consent management and real-time healthcare services.

---

# Main Features Demonstrated

## 1. Landing Page

The application provides three main options:

* Patient Login
* Doctor Login
* New Patient Registration

---

## 2. New Patient Registration

The registration form collects:

* Name
* Date of Birth
* Blood Group
* Phone Number
* Emergency Contact
* Medical Conditions
* Allergies
* Current Medications
* Medical History

After successful registration, the application displays:

> **Your MediTag profile has been created.**

The patient dashboard does not provide an edit option for the stored medical information in the current prototype.

---

## 3. Patient Login

The prototype provides a patient login flow using:

* Phone / Patient ID
* Demo OTP: `111222`

After login, the patient can:

* View their complete profile
* View their MediTag QR
* Download/print the QR
* View access information
* View doctor-updated information
* Listen to the care summary in Tamil

---

## 4. Doctor Login

The prototype provides a separate clinician login flow.

Demo credentials:

* Doctor ID: any demo doctor ID
* Password/verification: `MEDI123`
* Demo OTP: `333444`

After login, the doctor can:

* Scan a MediTag QR
* Identify a patient using the MediTag token
* View medical history
* View allergies
* View medications
* View medical conditions
* Add consultation notes
* Update medications
* Update allergies and conditions
* Save clinical updates
* View audit entries with timestamps

---

## 5. QR-Based Patient Identification

The MediTag QR contains a token in the following format:

```text
MEDI-TAG:<patient-token>
```

For example:

```text
MEDI-TAG:demo-ananya-1001
```

The QR does **not** contain the patient's medical history, allergies, medications or other medical information.

The token is used by the prototype to identify the corresponding patient record.

---

## 6. Access and Update Logging

The prototype demonstrates logging of access and clinical updates.

For example:

```text
Dr. Kumar updated medication
19 Sep 2026, 2:42 PM
```

This provides the foundation for a future audit trail in which patient access and record changes can be tracked.

---

## 7. Tamil Care Summary

The current hackathon prototype focuses specifically on **English and Tamil**.

Patients can use:

**Listen in Tamil**

to hear their care summary using the browser's Web Speech API with Tamil (`ta-IN`) speech synthesis.

The purpose is to make medical information easier for patients to understand after a consultation.

---

# Demo Patient

The application contains synthetic demo data for demonstration purposes.

**Patient ID:** `MT-1001`
**Name:** Ananya Rao
**Token:** `demo-ananya-1001`

If no patient has been registered in the browser yet, the demo patient can be used automatically.

> All demo patient information is synthetic and should not be replaced with real patient information in this prototype.

---

# Technology Stack

The current prototype uses:

* **HTML5**
* **CSS3**
* **Vanilla JavaScript**
* **QRCode.js** — QR generation
* **html5-qrcode** — QR scanning
* **localStorage** — prototype data persistence
* **sessionStorage** — temporary session data
* **Web Speech API** — Tamil voice playback
* **VS Code Live Server** — local development

---

# Running the Project

### Option 1 — VS Code Live Server

Open the project folder in VS Code and run it using **Live Server**.

### Option 2 — Python HTTP Server

Run:

```bash
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

QR camera scanning and browser speech features may require browser permissions and a secure context such as `localhost` or HTTPS.

---

# Future Enhancements

The current prototype demonstrates the core MediTag workflow. The following enhancements are planned for the next stages of development:

* Secure backend and cloud database integration
* Real-time OTP and SMS authentication
* Verified healthcare-professional accounts
* Secure patient consent and access-control management
* Patient-controlled access revocation
* Immutable medical-record versioning
* Enhanced audit trails for patient-record access and updates
* Medication and allergy interaction alerts
* AI-assisted medical summarization
* AI-assisted test and clinical-information suggestions
* Additional regional-language support
* Hospital and diagnostic-centre integration
* Production-level encryption and security
* Scalable deployment for real-world healthcare environments

AI-based features will be designed as **assistive tools for healthcare professionals**, with final medical decisions remaining with qualified healthcare professionals.

---

# Future Development

The next stages of MediTag will focus on:

1. Secure backend and database integration
2. Real OTP authentication
3. Verified healthcare-professional accounts
4. Patient consent and access control
5. Record versioning and stronger audit trails
6. Medication and allergy safety checks
7. AI-assisted medical summarization
8. Additional regional-language support
9. Hospital and diagnostic-centre integration
10. Production-level security and privacy controls

AI features are intended to **assist healthcare professionals rather than replace clinical decision-making**.

---

## Disclaimer

MediTag is currently a **hackathon prototype for demonstration and evaluation**.

It must not be used to store, process or make medical decisions using real patient data.

Production deployment would require appropriate security, privacy, authentication, infrastructure and healthcare compliance measures.
