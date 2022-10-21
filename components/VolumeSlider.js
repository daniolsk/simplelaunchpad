import React, { useEffect, useState } from 'react';
import styles from '../styles/VolumeSlider.module.css';

export default function VolumeSlider({ setVolumeOnButton, buttonId }) {
	const [volume, setVolume] = useState(50);

	const handleChange = (e) => {
		setVolume(e.target.value);
		setVolumeOnButton(buttonId, e.target.value);
	};

	return (
		<>
			<input type="range" value={volume} onChange={handleChange} name="volume" id="volume" className={styles.volumeSlider} />
		</>
	);
}
