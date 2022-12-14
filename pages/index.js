import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import AddButton from '../components/AddButton';
import VolumeSlider from '../components/VolumeSlider';

import { GithubPicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';

export default function Home({ defaultButtons }) {
	const [buttons, setButtons] = useState(defaultButtons);
	const [isAddingButtonDialog, setIsAddingButtonDialog] = useState(false);
	const [displayColorPicker, setDisplayColorPicker] = useState(false);

	const buttonsRef = useRef(buttons);
	const isAddingButtonDialogRef = useRef(isAddingButtonDialog);

	useEffect(() => {
		let tmpButtons = buttons;

		tmpButtons.forEach((btn) => {
			btn.sound = new Audio(btn.soundSrc);
			btn.sound.volume = 0.5;
		});

		setButtons(tmpButtons);
		buttonsRef.current = tmpButtons;

		const handleKeyDown = (e) => {
			if (e.repeat) {
				return;
			}

			let key = e.key;

			if (key == 'Escape') {
				buttonsRef.current.forEach((btn) => {
					btn.sound.pause();
					btn.sound.currentTime = 0;

					stopPlayingAll();
				});
			}

			if (!isAddingButtonDialogRef.current) {
				buttonsRef.current.forEach((btn) => {
					if (btn.key == key) {
						btn.sound.currentTime = 0;
						btn.sound.play();

						btn.sound.onended = () => {
							stopPlayingButton(btn.id);
						};

						setPlayingOnButton(btn.id);
					}
				});
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const setPlayingOnButton = (id) => {
		let tmpButtons = [...buttonsRef.current];

		tmpButtons.forEach((btn) => {
			if (btn.id == id) {
				btn.playing = true;
			}
		});

		setButtons([...tmpButtons]);
		buttonsRef.current = [...tmpButtons];
	};
	const stopPlayingButton = (id) => {
		let tmpButtons = [...buttonsRef.current];

		tmpButtons.forEach((btn) => {
			if (btn.id == id) {
				btn.playing = false;
			}
		});

		setButtons([...tmpButtons]);
		buttonsRef.current = [...tmpButtons];
	};
	const stopPlayingAll = () => {
		let tmpButtons = [...buttonsRef.current];

		tmpButtons.forEach((btn) => {
			btn.playing = false;
		});

		setButtons([...tmpButtons]);
		buttonsRef.current = [...tmpButtons];
	};

	const handleClick = (id, e) => {
		if (
			e.target.id == 'delete-button' ||
			e.target.id == 'delete-button-container' ||
			e.target.id == 'volume' ||
			e.target.id == 'color-picker'
		) {
			return;
		}

		buttons.forEach((btn) => {
			if (btn.id == id) {
				btn.sound.currentTime = 0;
				btn.sound.play();

				btn.sound.onended = () => {
					stopPlayingButton(id);
				};

				setPlayingOnButton(id);
			}
		});
	};

	const handleAddButtonDialog = () => {
		setIsAddingButtonDialog(true);
		isAddingButtonDialogRef.current = true;
	};

	const addButtons = (newButtons) => {
		setButtons([...buttons, ...newButtons]);
		buttonsRef.current = [...buttons, ...newButtons];

		setIsAddingButtonDialog(false);
		isAddingButtonDialogRef.current = false;
	};

	const handleDelete = (id) => {
		buttons.forEach((btn) => {
			if (btn.id == id) {
				btn.sound.pause();
			}
		});

		setButtons(buttons.filter((btn) => btn.id != id));
		buttonsRef.current = buttons.filter((btn) => btn.id != id);
	};

	const handleCancel = () => {
		setIsAddingButtonDialog(false);
		isAddingButtonDialogRef.current = false;
	};

	const refactorName = (name) => {
		let limit = 40;

		if (name.length > limit) {
			name = name.substring(0, limit);
			name += '...';
			return name;
		} else {
			return name;
		}
	};

	const setVolumeOnButton = (id, volume) => {
		buttons.forEach((btn) => {
			if (btn.id == id) {
				btn.sound.volume = volume / 100;
			}
		});
	};

	const handleColorChange = (id, color) => {
		let btns = [...buttons];

		btns.forEach((btn) => {
			if (btn.id == id) {
				btn.color = color.hex;
				btn.displayColorPicker = false;
			}
		});

		setButtons([...btns]);
	};

	const handleOpenColorPicker = (id) => {
		let btns = [...buttons];

		btns.forEach((btn) => {
			if (btn.id == id) {
				btn.displayColorPicker = !btn.displayColorPicker;
			}
		});

		setButtons([...btns]);
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Simple launchpad</title>
				<meta name="description" content="Just upload your sounds and have fun!" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta name="keywords" content="launchpad, music, sounds, play"></meta>
				<meta name="author" content="Daniel Skowron"></meta>
				<meta charSet="UTF-8"></meta>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.title}>
				<h1>Simple launchpad</h1>
			</div>
			<div className={styles.launchpadContainer}>
				<div className={styles.launchpad}>
					{buttons.map((btn) => (
						<div
							className={styles.button}
							id="button"
							style={{
								border: `7px solid ${btn.color}`,
								backgroundColor: `${btn.playing ? btn.color : 'rgb(39, 39, 39)'}`,
							}}
							onClick={(e) => handleClick(btn.id, e)}
							key={btn.id}
						>
							<div className={styles.firstRow}>
								<div className={styles.key}>{btn.key}</div>
								<div className={styles.delete} id="delete-button-container" onClick={() => handleDelete(btn.id)}>
									<Image width={22} height={22} id="delete-button" src="/delete.svg" alt="delete" />
								</div>
							</div>
							<div className={styles.name}>{refactorName(btn.name)}</div>
							<VolumeSlider buttonId={btn.id} setVolumeOnButton={setVolumeOnButton} />
							<button
								className={styles.openColorPickerButton}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									handleOpenColorPicker(btn.id);
								}}
							>
								Pick color
							</button>
							{btn.displayColorPicker ? (
								<div
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
								>
									<GithubPicker
										id="color-picker"
										width="100"
										onChangeComplete={(color) => {
											handleColorChange(btn.id, color);
										}}
										colors={['#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE']}
										triangle="top-left"
									/>
								</div>
							) : null}
						</div>
					))}
					<div className={styles.addNewButton} onClick={handleAddButtonDialog}></div>
				</div>
				{isAddingButtonDialog ? <AddButton cancel={handleCancel} addButtons={addButtons} /> : null}
			</div>
			<div className={styles.footer}>
				<div className={styles.instructions}>Press specific key (or click button) to play a sound | Press Escape to pause</div>
				<div>Daniel Skowron - Simple launchpad &copy; 2022</div>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			defaultButtons: [
				{
					id: uuidv4(),
					name: 'Clap',
					key: 'q',
					soundSrc: '/default_sounds/clap.wav',
					playing: false,
					color: 'red',
					displayColorPicker: false,
				},
				{
					id: uuidv4(),
					name: 'HiHat',
					key: 'w',
					soundSrc: '/default_sounds/hihat.wav',
					playing: false,
					color: 'green',
					displayColorPicker: false,
				},
				{
					id: uuidv4(),
					name: 'Kick',
					key: 'e',
					soundSrc: '/default_sounds/kick.wav',
					playing: false,
					color: 'blue',
					displayColorPicker: false,
				},
				{
					id: uuidv4(),
					name: 'Snare',
					key: 'r',
					soundSrc: '/default_sounds/snare.wav',
					playing: false,
					color: 'yellow',
					displayColorPicker: false,
				},
			],
		},
	};
}
