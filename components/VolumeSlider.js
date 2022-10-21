import React, { useEffect, useState } from 'react';

export default function volumeSlider({ setVolumeOnButton, buttonId }) {
	const [volume, setVolume] = useState(50);

	const handleChange = (e) => {
		setVolume(e.target.value);
		setVolumeOnButton(buttonId, e.target.value);
	};

	return (
		<>
			<input type="range" value={volume} onChange={handleChange} name="volume" id="volume" />
		</>
	);
}
