function ImagePopup({ card, onClose }) {
  return (
    <section className={`popap popap_open-card ${card ? "popap_opened" : ""}`}>
      <div className="popap__card-container">
        <figure className="popap__box">
          <button className="popap__close" type="button" onClick={onClose}></button>
          <img className="popap__image" src={card?.link} alt={card?.name} />
          <figcaption className="popap__caption">{card?.name}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export default ImagePopup;