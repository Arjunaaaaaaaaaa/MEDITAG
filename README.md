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

The MediTag QR contains a to
