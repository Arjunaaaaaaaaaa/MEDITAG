# MediTag

**MediTag** is a hackathon prototype for a digital health identity and medical-record system that helps patients and healthcare professionals access important medical information through a unique MediTag QR.

---

# Project Status

**Current stage: Review 2 Prototype**

MediTag has progressed from the initial frontend prototype toward a more functional emergency-access and authentication workflow.

The current prototype demonstrates:

- Patient and doctor workflows
- MediTag QR generation and scanning
- Patient medical-record display
- Doctor-side record updates
- Access and update logging
- Tamil voice-based care summary
- Real email-based OTP for emergency access
- Emergency verification before accessing emergency information

The application is still a hackathon prototype and does not use production-grade healthcare infrastructure.

---

# Problem

Patient medical information is often scattered across hospitals, clinics, paper reports and prescriptions.

This can make it difficult for healthcare professionals to quickly understand a patient's:

- Previous medical history
- Allergies
- Current medications
- Medical conditions
- Emergency information

Patients may also find it difficult to remember or explain their complete medical history and may not always understand medical advice after a consultation.

MediTag aims to make important patient information easier to access while providing a foundation for secure, patient-controlled medical records.

---

# Proposed Solution

MediTag provides each patient with a unique digital health identity and QR code.

The QR code contains only a **MediTag identifier/token**, not the patient's medical information.

The demonstrated workflow is:

**Patient → MediTag QR → Doctor/Clinician → Patient Record**

For emergency situations, MediTag adds an additional verification step:

**MediTag QR → Emergency Access → Email OTP Verification → Emergency Record**

The long-term goal is to connect this workflow to a secure backend, database, verified healthcare-professional authentication and patient-controlled consent management.

---

# Main Features Demonstrated

## 1. Landing Page

The application provides separate workflows for:

- Patient Login
- Doctor Login
- New Patient Registration
- Emergency Access

---

## 2. New Patient Registration

The registration form collects:

- Name
- Date of Birth
- Blood Group
- Phone Number
- Emergency Contact
- Medical Conditions
- Allergies
- Current Medications
- Medical History

After registration, a MediTag patient profile is created locally for the prototype.

The application can generate a unique MediTag token for the patient.

---

## 3. Patient Login

The patient workflow allows a patient to access their MediTag profile.

After login, the patient can:

- View personal information
- View medical information
- View their MediTag QR
- Download/print the QR
- View medical history
- View doctor-updated information
- View access history
- Listen to the Tamil care summary

The current patient authentication workflow is still being developed further toward complete backend-based authentication.

---

## 4. Doctor Login

The prototype provides a separate clinician workflow.

After doctor authentication, the doctor can:

- Search for a patient
- Identify a patient using the MediTag token
- View medical history
- View allergies
- View medications
- View medical conditions
- Add consultation notes
- Update medications
- Update allergies and conditions
- Update doctor advice
- Update the Tamil care summary
- Save clinical updates

Clinical updates are recorded in the prototype audit log with timestamps.

---

# 5. QR-Based Patient Identification

The MediTag QR contains a token in the following format:

```text
MEDI-TAG:<patient-token>
