"""
Example usage of the Pharmaceutical QMS Complaint Intake API.
Demonstrates all major endpoints and features.
"""
import requests
import json
from datetime import datetime, date


BASE_URL = "http://localhost:8000"


def print_section(title: str):
    """Print a formatted section header."""
    print(f"\n{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}\n")


def example_extract_complaint():
    """Example: Extract complaint data from raw text."""
    print_section("1. EXTRACT COMPLAINT FROM RAW TEXT")

    raw_text = """
    On January 15, 2024, a customer named John Doe called our complaints line
    regarding Aspirin. He purchased 2 bottles of Aspirin 500mg from a local pharmacy
    on June 10, 2023. The batch number was AB-2024-001 with expiry date June 10, 2025.

    The customer reported experiencing severe headaches after taking the medication,
    which is contrary to the product's intended use. This adverse reaction was
    concerning and he wanted to report it immediately.
    """

    payload = {"text": raw_text}

    print("Sending raw complaint text for extraction...")
    print(f"Text preview: {raw_text[:100]}...\n")

    response = requests.post(
        f"{BASE_URL}/api/extract",
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2, default=str))

    return result.get("extracted_data") if result.get("success") else None


def example_create_complaint(extracted_data=None):
    """Example: Create a complaint in the database."""
    print_section("2. CREATE COMPLAINT IN DATABASE")

    if extracted_data:
        print("Using extracted data from Step 1...\n")
        payload = {
            **extracted_data,
            "status": "Pending Triage"
        }
    else:
        print("Using manually provided complaint data...\n")
        payload = {
            "origin_source": "Customer",
            "customer_name": "Jane Smith",
            "product_name": "Ibuprofen",
            "product_strength": "400mg",
            "batch_number": "IB-2024-005",
            "mfg_date": "2023-08-15",
            "expiry_date": "2025-08-15",
            "quantity_affected": "1 bottle",
            "complaint_type": "Defective Product",
            "complaint_date": "2024-01-16",
            "description": "Customer reported tablet discoloration and unusual odor",
            "initial_severity": "Medium",
            "priority": "High",
            "status": "Pending Triage"
        }

    print("Creating complaint...")
    print(json.dumps(payload, indent=2, default=str))
    print()

    response = requests.post(
        f"{BASE_URL}/api/complaints",
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2, default=str))

    complaint_id = result.get("id")
    return complaint_id


def example_list_complaints():
    """Example: List complaints with filtering."""
    print_section("3. LIST COMPLAINTS WITH FILTERING")

    # List all
    print("Fetching all complaints (limit 10)...")
    response = requests.get(
        f"{BASE_URL}/api/complaints",
        params={"skip": 0, "limit": 10}
    )
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} complaints")
    print(json.dumps(response.json()[:1], indent=2, default=str))
    print("(showing first complaint only)\n")

    # Filter by product
    print("Filtering by product name 'Aspirin'...")
    response = requests.get(
        f"{BASE_URL}/api/complaints",
        params={
            "product_name": "Aspirin",
            "limit": 10
        }
    )
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} Aspirin complaints\n")

    # Filter by status
    print("Filtering by status 'Pending Triage'...")
    response = requests.get(
        f"{BASE_URL}/api/complaints",
        params={
            "status": "Pending Triage",
            "limit": 10
        }
    )
    print(f"Status Code: {response.status_code}")
    print(f"Found {len(response.json())} complaints pending triage")


def example_get_complaint(complaint_id: int):
    """Example: Get a specific complaint."""
    print_section("4. GET SPECIFIC COMPLAINT")

    if not complaint_id:
        print("No complaint ID provided, skipping...")
        return

    print(f"Fetching complaint ID {complaint_id}...")
    response = requests.get(f"{BASE_URL}/api/complaints/{complaint_id}")

    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2, default=str))


def example_update_complaint(complaint_id: int):
    """Example: Update a complaint."""
    print_section("5. UPDATE COMPLAINT")

    if not complaint_id:
        print("No complaint ID provided, skipping...")
        return

    print(f"Updating complaint ID {complaint_id}...\n")

    payload = {
        "origin_source": "Customer",
        "customer_name": "John Doe",
        "product_name": "Aspirin",
        "product_strength": "500mg",
        "batch_number": "AB-2024-001",
        "mfg_date": "2023-06-10",
        "expiry_date": "2025-06-10",
        "quantity_affected": "2 bottles",
        "complaint_type": "Adverse Effect",
        "complaint_date": "2024-01-15",
        "description": "Customer reported headaches. Investigation in progress.",
        "initial_severity": "High",
        "priority": "High",
        "status": "In Investigation"  # Changed status
    }

    response = requests.put(
        f"{BASE_URL}/api/complaints/{complaint_id}",
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2, default=str))


def example_chat_about_complaint():
    """Example: Chat about a complaint."""
    print_section("6. CHAT ABOUT COMPLAINT")

    complaint_text = "Aspirin batch AB-2024-001 (500mg) purchased 6/10/2023, expiring 6/10/2025. Customer reported severe headache after taking 1 tablet on 1/15/2024."
    question = "Based on this complaint, what severity level would you assign and what are the key risk factors we should investigate?"

    print("Complaint Text:")
    print(f"  {complaint_text}\n")

    print("Question:")
    print(f"  {question}\n")

    print("Sending to Groq for analysis...")

    payload = {
        "complaint_text": complaint_text,
        "question": question
    }

    response = requests.post(
        f"{BASE_URL}/api/chat",
        json=payload
    )

    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2, default=str))


def example_health_check():
    """Example: Health check."""
    print_section("HEALTH CHECK")

    print("Checking API health...")
    response = requests.get(f"{BASE_URL}/health")

    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(json.dumps(result, indent=2, default=str))


def main():
    """Run all examples."""
    print("\n" + "="*60)
    print("  Pharmaceutical QMS - API Usage Examples")
    print("="*60)

    try:
        # Health check
        example_health_check()

        # Extraction
        extracted_data = example_extract_complaint()

        # Create complaint
        complaint_id = example_create_complaint(extracted_data)

        # List complaints
        example_list_complaints()

        # Get specific complaint
        example_get_complaint(complaint_id)

        # Update complaint
        example_update_complaint(complaint_id)

        # Chat about complaint
        example_chat_about_complaint()

        print("\n" + "="*60)
        print("  All examples completed successfully!")
        print("="*60 + "\n")

    except requests.exceptions.ConnectionError:
        print("\n❌ ERROR: Could not connect to API at", BASE_URL)
        print("   Make sure the server is running: python run.py")
        print("   Check SETUP.md for configuration instructions.\n")

    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}\n")


if __name__ == "__main__":
    main()
