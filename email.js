async function sendForm(data) {
  try {
    const res = await fetch("/.netlify/functions/sendMail", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.status === 405) {
      alert("Error: 405 Method Not Allowed.\n\nIt looks like you are using VS Code Live Server (port 5500). Static servers cannot run Netlify functions.\n\nPlease stop Live Server and run 'npm run dev' to use the Netlify CLI instead.");
      return false;
    }

    const result = await res.json().catch(() => ({
      error: "The server returned an invalid response.",
    }));
    alert(result.message || result.error);
    return res.ok;
  } catch (error) {
    console.error("Fetch Error:", error);
    alert("An error occurred while sending the email. Ensure you are running 'netlify dev' and not Live Server.");
    return false;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const quoteForm = document.getElementById("quoteForm");
  
  if (quoteForm) {
    quoteForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const data = {
        name: document.getElementById("q_name").value,
        email: document.getElementById("q_email").value,
        phone: document.getElementById("q_phone").value,
        message: document.getElementById("q_message").value,
      };
      
      const btn = quoteForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      const success = await sendForm(data);
      if (success) {
        document.getElementById("quoteStatus").innerText = "✅ Sent successfully!";
        quoteForm.reset();
        btn.innerHTML = originalText;
        btn.disabled = false;
      } else {
        document.getElementById("quoteStatus").innerText = "❌ Failed. Try again.";
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }

  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      
      const data = {
        name: (document.getElementById("fname").value + " " + document.getElementById("lname").value).trim(),
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        destination: document.getElementById("destination").value,
        travelDate: document.getElementById("travel_date").value,
        travellers: document.getElementById("travellers").value,
        tourType: document.getElementById("tour_type").value,
        budget: document.getElementById("budget").value,
        message: document.getElementById("message").value
      };

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      const success = await sendForm(data);
      if (success) {
        contactForm.style.display = "none";
        document.getElementById("successMsg").style.display = "block";
      } else {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    });
  }
});
