window.addEventListener('DOMContentLoaded', (event) => {
    const inputImage = document.getElementById('input-image');
    const preview = document.getElementById('preview');
    const resultDiv = document.getElementById('result');
    const resizedImageDiv = document.getElementById('resized-image');
    const downloadLink = document.getElementById('download-link');
    const resizeForm = document.getElementById('resize-form');
    const sizeInput = document.getElementById('size');
    const unitSelect = document.getElementById('unit');
  
    inputImage.addEventListener('change', (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = function () {
          preview.innerHTML = '';
          resultDiv.style.display = 'none';
  
          const imgElement = document.createElement('img');
          imgElement.src = this.src;
          preview.appendChild(imgElement);
        };
      };
  
      reader.readAsDataURL(file);
    });
  
    resizeForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const size = parseFloat(sizeInput.value);
      const unit = unitSelect.value;
      const file = inputImage.files[0];
  
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = function () {
          const targetSize = size * getUnitMultiplier(unit);
          const resizedImage = resizeImage(img, targetSize, file.type);
  
          resizedImageDiv.innerHTML = '';
          resizedImageDiv.appendChild(resizedImage);
          resultDiv.style.display = 'flex';
          resultDiv.style.justifyContent = 'center';
          resultDiv.style.flexDirection='column'
          resultDiv.style.alignItems='center'
          downloadLink.href = resizedImage.src;
        };
      };
  
      reader.readAsDataURL(file);
    });
  
    function getUnitMultiplier(unit) {
      const unitMap = {
        kb: 1024,
        mb: 1024 * 1024,
      };
      return unitMap[unit];
    }
  
    function resizeImage(img, targetSize, mimeType) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
  
      let width = img.width;
      let height = img.height;
  
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
  
      canvas.width = width;
      canvas.height = height;
  
      ctx.drawImage(img, 0, 0, width, height);
  
      let quality = 1;
      let resizedImg = canvas.toDataURL(mimeType, quality);
  
      while (resizedImg.length > targetSize) {
        quality -= 0.1;
        resizedImg = canvas.toDataURL(mimeType, quality);
      }
  
      const finalImage = new Image();
      finalImage.src = resizedImg;
  
      return finalImage;
    }
  });
  