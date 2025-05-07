class SideTogglerComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <button class="toggle-btn btn d-lg-none" 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#sidemenu"
                aria-expanded="false"
                aria-controls="sidemenu">
                <i class="fa-solid fa-bars"></i>
            </button>
      `;
    }
}
customElements.define('side-toggler', SideTogglerComponent);