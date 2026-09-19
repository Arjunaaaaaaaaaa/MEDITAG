# MediTag

## Digital Emergency Health Record & Medical Identity System

MediTag is a digital health-record prototype designed to make essential patient medical information easier to access during emergencies.

The system uses a unique MediTag identifier and QR code to connect a patient with their digital medical record. The QR code itself does not contain medical information. It contains only the patient's MediTag token.

The project focuses on improving emergency access to important information such as blood group, allergies, medical conditions, medications, medical history, and doctor advice.

---

## 1. Problem Statement

Medical information is often scattered across hospitals, clinics, paper records, and different healthcare providers.

During an emergency, important information may not be immediately available to the treating team. This can create difficulties such as:

- Missing allergy information
- Unknown medications
- Incomplete medical history
- Difficulty identifying the patient
- Delays in accessing previous records
- Patients being unable to clearly communicate their medical history
- Lack of a simple mechanism for sharing essential emergency information

MediTag aims to provide a centralized digital record prototype that can be accessed through a patient-specific identifier and QR code.

---

## 2. Proposed Solution

MediTag provides a digital medical identity for each patient.

A patient can have:

- A unique MediTag ID
- A unique QR/token
- Personal information
- Blood group
- Medical conditions
- Allergies
- Current medications
- Medical history
- Emergency contact information
- Doctor advice
- Tamil patient-care summary
- Access history
- Update history

The QR code acts as a pointer to the patient's MediTag identity rather than storing medical information directly.

---

## 3. Key Features

### Patient Registration

Patients can create a MediTag profile containing information such as:

- Name
- Date of birth
- Blood group
- Phone number
- Email
- Emergency contact
- Medical conditions
- Allergies
- Medications
- Medical history

---

### Patient Login

The patient can log in using their MediTag ID.

The current prototype includes a demonstration login flow.

After login, the patient can view their medical profile and other MediTag information.

---

### Digital Medical Profile

The patient dashboard displays important information including:

- Personal information
- Blood group
- Medical conditions
- Allergies
- Medications
- Medical history
- Doctor advice
- Emergency contact

This provides a single view of important medical information.

---

### QR Code Generation

Each patient has a MediTag token.

Example:

```text
MEDI-TAG:demo-ananya-1001
```

### QR Code Scanning

The emergency-access section includes QR scanning functionality using html5-qrcode.

The intended workflow is:

Patient QR
     ↓
QR Scanner
     ↓
MediTag Token
     ↓
Patient Record
     ↓
Emergency Information

A manual MediTag token can also be entered when required.

###Doctor Login

The prototype includes a separate doctor login interface.

A doctor can:

Log in to the doctor dashboard
Search for a patient
View patient information
Update doctor advice
Add Tamil care instructions
View/update record information
Generate access/update log entries

The doctor authentication in the current prototype is intended for demonstration purposes.

###Emergency Access

MediTag provides a separate emergency-access workflow.

The emergency section allows the responder to:

Scan the patient's QR code
Retrieve the MediTag token
Request emergency verification
Enter the OTP
Access the emergency medical record

The emergency OTP functionality is connected to the backend email service.

### Email OTP Verification

The emergency-access workflow uses a Node.js/Express backend with Resend for email delivery.

The backend:

Generates a six-digit OTP
Sends the OTP through email
Gives the OTP a limited validity period
Verifies the submitted OTP
Rejects expired or incorrect OTPs

The current prototype uses a 15-minute OTP validity period.

The OTP is generated and handled by the backend rather than being generated only in frontend JavaScript.

### Access Logging

MediTag records access-related events in the prototype.

Examples include:

Patient login
Doctor access
Emergency access
Record updates

This provides an audit-style history of interactions with the medical record.

### Doctor Advice

Doctors can provide patient-specific advice through the doctor dashboard.

The patient can then view this advice from the patient dashboard.

The prototype also supports a separate Tamil care summary.

### Tamil Care Summary

MediTag includes a Tamil-language care summary to make doctor instructions easier for patients to understand.

Example:
பரிந்துரைக்கப்பட்ட மருந்தை உணவுக்குப் பிறகு
தினமும் இரண்டு முறை எடுத்துக்கொள்ளுங்கள்.
போதுமான அளவு தண்ணீர் குடிக்கவும்.
7 நாட்களுக்குப் பிறகு மீண்டும் பரிசோதனைக்கு வாருங்கள்.

The system provides:

Tamil text
Play button
Stop button
Tamil speech synthesis

The Web Speech API is used with the ta-IN language setting when a Tamil voice is available in the browser.

4. System Workflow
Patient Workflow
Patient
   ↓
Registration / Login
   ↓
MediTag Profile
   ↓
Medical Information
   ↓
QR Code Generation
   ↓
Patient carries/shares QR

### Emergency Workflow

Emergency Responder
        ↓
Scan MediTag QR
        ↓
Retrieve MediTag Token
        ↓
Emergency Verification
        ↓
Email OTP
        ↓
OTP Verification
        ↓
Emergency Medical Record

### Doctor Workflow
Doctor Login
     ↓
Doctor Dashboard
     ↓
Find Patient
     ↓
View Medical Record
     ↓
Update Advice
     ↓
Tamil Care Summary
     ↓
Access/Update Log

## 5. QR Code Format

MediTag uses a token-based QR format.

Example:

MEDI-TAG:demo-ananya-1001

The QR code should contain only the MediTag token.

It should not contain sensitive medical information such as:

Medical history
Allergies
Medications
Phone numbers
Doctor notes

This design helps prevent sensitive medical information from being directly exposed through the QR code.

## 6. Current Demo Patient

The prototype includes a demonstration patient for testing.

Patient ID:
MT-1001

Name:
Ananya Rao

MediTag Token:
demo-ananya-1001

Blood Group:
O+

Condition:
Asthma

Allergy:
Penicillin

Medication:
Salbutamol inhaler

The demonstration patient is used for testing the prototype workflow.

## 7. Technology Stack
Frontend
HTML5
CSS3
JavaScript
QRCode.js
html5-qrcode
Web Speech API
Web Storage API
PWA Manifest
Service Worker
Backend
Node.js
Express.js
CORS
dotenv
Resend
Node.js Crypto module
Storage

The current prototype primarily uses browser storage for patient records and logs.
The backend currently handles emergency OTP generation and verification.

### Current Implementation Status

The project is currently in the Post-Review 2 / Iteration stage.
Implemented
MediTag landing page
Patient login interface
Patient dashboard
Doctor login interface
Doctor dashboard
Patient medical information
QR generation
QR scanning interface
Manual MediTag token entry
Emergency access interface
Emergency email OTP
OTP verification
Doctor advice
Tamil care summary
Tamil voice playback
Access/update logging
PWA-related files
Prototype / Demonstration Components

Some authentication and patient-management functionality is still implemented as a prototype rather than as a production healthcare system.

### Security Considerations

MediTag is a healthcare-related prototype and therefore handles information that can be sensitive.
The current prototype should not be considered a production medical-record system.
Important future security requirements include:

Encryption in transit
Encryption at rest
Strong authentication
Role-based authorization
Secure password/OTP handling
Audit logging
Session expiration
Access revocation
Input validation
Secure API endpoints
Database security
Backup and recovery
Privacy and compliance requirements
The QR code should continue to contain only an identifier/token rather than the patient's medical information.

### Possible future improvements include:

Cloud database
Secure patient accounts
Verified doctor accounts
Hospital integration
Multi-hospital record access
Emergency responder access controls
Role-based permissions
Patient-controlled record sharing
Access revocation
Detailed audit history
Medical record version history
Multilingual summaries
Improved voice support
Offline emergency information
Secure API architecture
Mobile application
Hospital/EHR integration

### Limitations

MediTag is currently a prototype developed for demonstration and hackathon purposes.
It is not intended to replace:

Hospital information systems
Electronic health record systems
Professional medical judgment
Emergency medical services
Clinical decision-making

The AI-related and automated features, where applicable, should be treated as assistance rather than medical diagnosis or treatment recommendations.

## Known Issues Identified During Review 2

During Review 2 testing, the QR workflow showed an intermittent issue where some downloaded MediTag QR codes resulted in:

- "Patient not found"
- "Invalid QR"

The QR workflow had worked during earlier testing, so further debugging is required to determine whether the issue is related to QR generation, token parsing, token lookup, or browser-based patient storage.

The current prototype also stores patient records using browser `localStorage`. Because browser storage is tied to the browser and application origin, records may not appear when the application is opened using a different browser, browser profile, host, or port.

These limitations are planned to be addressed by moving patient records to a centralized backend/database and improving the QR-to-patient lookup workflow.

### Disclaimer

MediTag is a student/hackathon prototype intended to demonstrate a concept for digital emergency medical identity and record access.
It is not a certified medical device or production healthcare information system.
Medical decisions should always be made by qualified healthcare professionals using appropriate clinical information.

### Project Status

Current Stage: Post-Review 2 / Iteration
The core MediTag prototype and emergency email OTP workflow have been demonstrated.
The next major development priorities are:
Reliable QR-to-patient lookup
Backend/database-based patient records
Secure patient authentication
Improved doctor authentication
Stronger access control and audit logging
Production-level security

### MediTag Project Team
Developed as a hackathon/project prototype for demonstrating a digital emergency medical record and patient identity system.
