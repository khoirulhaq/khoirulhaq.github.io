/**
 * Projects dynamic rendering script
 */
async function renderProjects() {
    const container = document.getElementById('project-cards-container');
    const modalContainer = document.getElementById('project-modals-container');
    
    // If placeholders aren't present yet, it means the projects section hasn't been loaded
    if (!container || !modalContainer) return;

    // Detect language and root path
    const lang = document.documentElement.lang || 'en';
    const isIndo = lang === 'id';
    // If lang is 'id', we are in the /id/ directory, so assets are one level up
    const rootPath = isIndo ? '../' : '';
    const jsonPath = rootPath + 'assets/data/projects.json';

    try {
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error('Failed to fetch projects data');
        const projects = await response.json();

        let cardsHtml = '';
        let modalsHtml = '';

        projects.forEach((project, index) => {
            const delay = (index % 3 + 1) * 100; // Carousel-like delay (100, 200, 300)
            const title = project.title[lang] || project.title['en'];
            const description = project.description[lang] || project.description['en'];
            const imgPath = rootPath + project.image;
            
            // Generate Project Cards
            cardsHtml += `
                <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${delay}">
                    <div class="card h-100">
                        <div class="position-relative">
                            <img src="${imgPath}" class="card-img-top" alt="${title}">
                            <div class="card-img-overlay d-flex align-items-end p-0">
                                <div class="w-100 text-center p-3" style="background: rgba(0,0,0,0.7);">
                                    <div class="d-flex justify-content-center gap-2">
                                        ${project.github ? `
                                        <a href="${project.github}" class="btn btn-sm btn-outline-light" target="_blank">
                                            <i class="bi bi-github me-1"></i> ${isIndo ? 'Kode' : 'Code'}
                                        </a>` : ''}
                                        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#${project.id}Modal">
                                            <i class="bi bi-info-circle me-1"></i> ${isIndo ? 'Detail' : 'Details'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">${description}</p>
                            <div class="mt-3">
                                ${project.tags.map(tag => `<span class="badge bg-primary me-2">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Generate Modals for each project
            let carouselItems = project.modalImages.map((img, i) => `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <img src="${rootPath + img}" class="d-block w-100" alt="Documentation ${i + 1}">
                </div>
            `).join('');

            modalsHtml += `
                <div class="modal fade" id="${project.id}Modal" tabindex="-1" aria-labelledby="${project.id}ModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="${project.id}ModalLabel">${title} - ${isIndo ? 'Dokumentasi' : 'Documentation'}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div id="${project.id}Carousel" class="carousel slide" data-bs-ride="carousel">
                                    <div class="carousel-inner">
                                        ${carouselItems}
                                    </div>
                                    <button class="carousel-control-prev" type="button" data-bs-target="#${project.id}Carousel" data-bs-slide="prev">
                                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">${isIndo ? 'Sebelumnya' : 'Previous'}</span>
                                    </button>
                                    <button class="carousel-control-next" type="button" data-bs-target="#${project.id}Carousel" data-bs-slide="next">
                                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span class="visually-hidden">${isIndo ? 'Selanjutnya' : 'Next'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = cardsHtml;
        modalContainer.innerHTML = modalsHtml;

        // Re-initialize AOS to detect new elements
        if (window.AOS) {
            AOS.refresh();
        }

    } catch (error) {
        console.error('Error rendering projects:', error);
    }
}
