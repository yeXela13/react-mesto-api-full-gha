import React from "react";

function InfoTooltip({infoToolTipData, name, isOpen, onClose }) {
  return (
    <section className={`popap popap_${name} ${isOpen ? "popap_opened" : ""}`}>
      <div className="popap__container">
        <img src={infoToolTipData.image} className="popap__message" alt={infoToolTipData.text} />
        <h2 className="popap__title">{infoToolTipData.text}</h2>
        <button aria-label="сlose" className="popap__close" type="button" onClick={onClose}></button>
      </div>
    </section>
  );

}

export default InfoTooltip;