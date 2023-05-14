function RoomInfo() {
  return (
    <div className="room-info">
      <h1 className="info-title">Ваша заброньована палата:</h1>
      <h1 className="info-number">номпер палаты 13</h1>
      <p className="info-name">название палаты</p>
      <p className="info-description">
        Палата на одну особу: включає цілодобове медичне обслуговування,
        індивідуальний догляд, зручне ліжко, особистий санвузол та смачне
        харчування для матері, а також різні зручності, а також різні медичні
        приладдя, інструменти та обладнання для пологів
      </p>
      <p className="info-start-date">Дата заселение 23-05-2023</p>
      <p className="info-end-date">Дата заселение 30-05-2023</p>
      <p className="info-price">цена палаты</p>
      <h6>Скасувати бронювання</h6>
    </div>
  );
}

export default RoomInfo;
