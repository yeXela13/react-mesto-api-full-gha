function PopupWithForm({ title, name, children, textButton, isOpen, onClose, onSubmit }) {
    return (
        <section className={`popap popap_${name} ${isOpen ? "popap_opened" : ""}`}>
            <div className="popap__container">
                <h2 className="form__title">{title}</h2>
                <button aria-label="сlose" className="popap__close" type="button" onClick={onClose}></button>
                <form onSubmit={onSubmit} className={`form form_${name}`} name={`${name}`}>
                    {children}
                    <button aria-label="submit" className="form__button" type="submit">{textButton}</button>
                </form>
            </div>
        </section>
    );
}

export default PopupWithForm;