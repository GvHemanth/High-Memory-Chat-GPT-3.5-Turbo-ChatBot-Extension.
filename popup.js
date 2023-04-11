document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const input = document.querySelector('#input');
  const output = document.querySelector('#output');
  const loading = document.getElementById('loading');

  let previousResponses = [];

  // Load previous chat history from localStorage, if available
  const savedResponses = localStorage.getItem('chatHistory');
  if (savedResponses) {
    previousResponses = JSON.parse(savedResponses);
    // Render previous chat history to the screen
    previousResponses.forEach(response => {
      if (response.role === 'user') {
        output.innerHTML += `<br><strong>User:</strong> ${response.content}<br>`;
      } else {
        output.innerHTML += `<br><strong>Assistant:</strong> ${response.content}<br>`;
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const prompt = `"${input.value.trim()}".`;
    output.innerHTML += `<br><strong>User:</strong> ${prompt}<br>`;
    previousResponses.push({"role": "user", "content": prompt});
    localStorage.setItem('chatHistory', JSON.stringify(previousResponses));

    console.log('Prompt:', prompt);

    loading.style.display = 'block'; // Show the loading symbol

    fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: previousResponses
      })
    })
    .then(response => response.json())
    .then(data => {
      loading.style.display = 'none'; // Hide the loading symbol
      
      if (data.choices && data.choices.length > 0) {
        var responseText = data.choices[0].message.content;
        
        output.innerHTML += `<br><strong>Assistant:</strong> ${responseText}<br>`;
        previousResponses.push({"role": "assistant", "content": responseText});
        localStorage.setItem('chatHistory', JSON.stringify(previousResponses));
      } else {
        output.innerHTML += `<br><strong>assistant:</strong> Sorry, I couldn't understand. Please try again.<br>`;
      }
    })
    .catch(error => {
      console.error(error);
    });
    
    // Clear the input field after submission
    input.value = '';
  });
});
