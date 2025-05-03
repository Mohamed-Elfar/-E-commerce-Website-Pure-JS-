class FeaturesComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML = ` 
            <section class="container">
                <div class="row text-center g-4">
                    <div class="col-lg-4 col-md-6">
                        <div>
                            <div class="outer-circle mb-3">
                            <div class="icon-circle">
                                <i class="fas fa-shipping-fast"></i>
                            </div>
                            </div>
                            <h6>FREE AND FAST DELIVERY</h6>
                            <p class="text-muted">Free delivery for all orders over $140</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <div>
                            <div class="outer-circle mb-3">
                            <div class="icon-circle">
                                <i class="fas fa-headset"></i>
                            </div>
                            </div>
                            <h6>24/7 CUSTOMER SERVICE</h6>
                            <p class="text-muted">Friendly 24/7 customer support</p>
                        </div>
                    </div>
                    <div class="col-lg-4 col-md-6 mx-md-auto">
                        <div>
                            <div class="outer-circle mb-3">
                            <div class="icon-circle">
                                <i class="fas fa-undo"></i>
                            </div>
                            </div>
                            <h6>MONEY BACK GUARANTEE</h6>
                            <p class="text-muted">We return money within 30 days</p>
                        </div>
                    </div>
                </div>
            </section>`;
    }
}

customElements.define('features-section', FeaturesComponent);