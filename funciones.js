// Soluciones correctas
const correct1 = {
    "Aurícula derecha": "Recibe sangre pobre en oxígeno de las venas cavas",
    "Aurícula izquierda": "Recibe sangre rica en oxígeno de las venas pulmonares",
    "Ventrículo derecho": "Bombea sangre pobre en oxígeno hacia los pulmones",
    "Ventrículo izquierdo": "Bombea sangre rica en oxígeno hacia la aorta",
    "Válvula mitral": "Permite el paso de sangre de la aurícula izquierda al ventrículo izquierdo",
    "Válvula tricúspide": "Permite el paso de sangre de la aurícula derecha al ventrículo derecho",
    "Válvula aórtica": "Impide el retorno de sangre de la aorta al ventrículo izquierdo",
    "Válvula pulmonar": "Impide el retorno de sangre de la arteria pulmonar al ventrículo derecho"
  };
  const correct2 = {
    0: "Infarto agudo de miocardio",
    1: "Angina de pecho estable",
    2: "Insuficiencia cardíaca",
    3: "Feocromocitoma",
    4: "Endocarditis"
  };
  const correct3 = [
    "Contracción auricular (diástole ventricular)",
    "Apertura de válvulas auriculoventriculares",
    "Contracción ventricular (sístole ventricular)",
    "Cierre de válvulas semilunares",
    "Relajación ventricular (diástole)"
  ];
  const correct4 = {
    "Precarga": "Grado de estiramiento de las fibras miocárdicas antes de la contracción ventricular",
    "Poscarga": "Carga contra la que el corazón debe contraerse para expulsar la sangre",
    "Sístole": "Fase de contracción del músculo cardíaco",
    "Diástole": "Fase de relajación y llenado del corazón"
  };
  
  // Drag and drop para matching
  function setupDragAndDrop(areaId) {
    const dragItems = document.getElementById(areaId);
    const dropzones = dragItems.parentElement.querySelectorAll('.dropzone');
  
    dragItems.querySelectorAll('.draggable').forEach(item => {
      item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.textContent);
        e.dataTransfer.setData('source', areaId);
        e.dataTransfer.effectAllowed = 'move';
        setTimeout(() => { item.style.display = 'none'; }, 0);
      });
      item.addEventListener('dragend', e => {
        item.style.display = 'inline-block';
      });
    });
  
    dropzones.forEach(zone => {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.style.background = '#d0f0c0';
      });
      zone.addEventListener('dragleave', e => {
        zone.style.background = '#f0f8ff';
      });
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.style.background = '#f0f8ff';
        const data = e.dataTransfer.getData('text/plain');
        if (zone.firstChild) {
          dragItems.appendChild(zone.firstChild);
        }
        const allDraggables = document.querySelectorAll(`#${areaId} .draggable`);
        for (let i = 0; i < allDraggables.length; i++) {
          if (allDraggables[i].textContent === data) {
            zone.appendChild(allDraggables[i]);
            break;
          }
        }
      });
      zone.addEventListener('dblclick', function() {
        if (zone.firstChild) {
          dragItems.appendChild(zone.firstChild);
        }
      });
    });
  }
  
  setupDragAndDrop('drag-items-1');
  setupDragAndDrop('drag-items-2');
  setupDragAndDrop('drag-items-4');
  
  // Sortable para ordenar
  let draggedItem = null;
  const sortableList = document.getElementById('sortable-list');
  sortableList.addEventListener('dragstart', function(e) {
    if (e.target.classList.contains('sortable-item')) {
      draggedItem = e.target;
      setTimeout(() => e.target.style.display = 'none', 0);
    }
  });
  sortableList.addEventListener('dragend', function(e) {
    if (draggedItem) {
      draggedItem.style.display = 'block';
      draggedItem = null;
    }
  });
  sortableList.addEventListener('dragover', function(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(sortableList, e.clientY);
    if (afterElement == null) {
      sortableList.appendChild(draggedItem);
    } else {
      sortableList.insertBefore(draggedItem, afterElement);
    }
  });
  
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable-item:not([style*="display: none"])')];
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child }
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
  
  // Resolver: comprobar y colorear
  document.getElementById('resolver').onclick = function() {
    // 1. Corazón
    const dropzones1 = document.querySelectorAll('#drag-items-1').parentElement.querySelectorAll('.dropzone');
    const labels1 = ["Aurícula derecha","Aurícula izquierda","Ventrículo derecho","Ventrículo izquierdo","Válvula mitral","Válvula tricúspide","Válvula aórtica","Válvula pulmonar"];
    dropzones1.forEach((zone, i) => {
      zone.classList.remove('correct-zone','incorrect-zone');
      if (zone.firstChild && zone.firstChild.textContent === correct1[labels1[i]]) {
        zone.classList.add('correct-zone');
      } else if (zone.firstChild) {
        zone.classList.add('incorrect-zone');
      }
      zone.classList.add('disabled');
      if (zone.firstChild) zone.firstChild.setAttribute('draggable', 'false');
    });
    document.getElementById('drag-items-1').classList.add('disabled');
  
    // 2. Síntomas
    const dropzones2 = document.querySelectorAll('#drag-items-2').parentElement.querySelectorAll('.dropzone');
    dropzones2.forEach((zone, i) => {
      zone.classList.remove('correct-zone','incorrect-zone');
      if (zone.firstChild && zone.firstChild.textContent === correct2[i]) {
        zone.classList.add('correct-zone');
      } else if (zone.firstChild) {
        zone.classList.add('incorrect-zone');
      }
      zone.classList.add('disabled');
      if (zone.firstChild) zone.firstChild.setAttribute('draggable', 'false');
    });
    document.getElementById('drag-items-2').classList.add('disabled');
  
    // 3. Orden ciclo cardíaco
    const items3 = Array.from(document.querySelectorAll('#sortable-list .sortable-item'));
    items3.forEach((item, i) => {
      item.parentElement.classList.remove('correct-zone','incorrect-zone');
      if (item.textContent === correct3[i]) {
        item.parentElement.classList.add('correct-zone');
      } else {
        item.parentElement.classList.add('incorrect-zone');
      }
      item.setAttribute('draggable', 'false');
    });
    document.getElementById('sortable-list').classList.add('disabled');
  
    // 4. Conceptos
    const dropzones4 = document.querySelectorAll('#drag-items-4').parentElement.querySelectorAll('.dropzone');
    const labels4 = ["Precarga","Poscarga","Sístole","Diástole"];
    dropzones4.forEach((zone, i) => {
      zone.classList.remove('correct-zone','incorrect-zone');
      if (zone.firstChild && zone.firstChild.textContent === correct4[labels4[i]]) {
        zone.classList.add('correct-zone');
      } else if (zone.firstChild) {
        zone.classList.add('incorrect-zone');
      }
      zone.classList.add('disabled');
      if (zone.firstChild) zone.firstChild.setAttribute('draggable', 'false');
    });
    document.getElementById('drag-items-4').classList.add('disabled');
  
    // Desactivar botón
    this.disabled = true;
    this.style.opacity = 0.6;
    this.textContent = "Resuelto";
  };