import React, { useState } from 'react';
import { ReactComponent as WhiteLogo } from '../../assets/icons/DiscordIconWhite.svg';
import { ReactComponent as BlueLogo } from '../../assets/icons/DiscordIconBlue.svg';

function ToggleLogo() {
  const [isWhite, setIsWhite] = useState(true);

  const handleClick = () => {
    setIsWhite(!isWhite);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      {isWhite ? <WhiteLogo /> : <BlueLogo />}
    </div>
  );
}

export default ToggleLogo;
