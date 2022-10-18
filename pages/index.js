import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import AddButton from '../components/AddButton';

export default function Home({ defaultButtons }) {
	const [buttons, setButtons] = useState(defaultButtons);
	const [isAddingButtonDialog, setIsAddingButtonDialog] = useState(false);

	const buttonsRef = useRef(buttons);
	const isAddingButtonDialogRef = useRef(isAddingButtonDialog);

	useEffect(() => {
		let tmpButtons = buttons;

		tmpButtons.forEach((btn) => {
			btn.sound = new Audio(btn.soundSrc);
			btn.sound.volume = 0.7;
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
							stopPlayingButton(key);
						};

						setPlayingOnButton(key);
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

	const setPlayingOnButton = (key) => {
		let tmpButtons = [...buttonsRef.current];

		tmpButtons.forEach((btn) => {
			if (btn.key == key) {
				btn.playing = true;
			}
		});

		setButtons([...tmpButtons]);
		buttonsRef.current = [...tmpButtons];
	};
	const stopPlayingButton = (key) => {
		let tmpButtons = [...buttonsRef.current];

		tmpButtons.forEach((btn) => {
			if (btn.key == key) {
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

	const handleClick = (key, e) => {
		if (e.target.id == 'delete-button' || e.target.id == 'delete-button-container') {
			return;
		}

		buttons.forEach((btn) => {
			if (btn.key == key) {
				btn.sound.currentTime = 0;
				btn.sound.play();

				btn.sound.onended = () => {
					stopPlayingButton(key);
				};

				setPlayingOnButton(key);
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

	const handleDelete = (key) => {
		buttons.forEach((btn) => {
			if (btn.key == key) {
				btn.sound.pause();
			}
		});

		setButtons(buttons.filter((btn) => btn.key != key));
		buttonsRef.current = buttons.filter((btn) => btn.key != key);
	};

	const handleCancel = () => {
		setIsAddingButtonDialog(false);
		isAddingButtonDialogRef.current = false;
	};

	const refactorName = (name) => {
		let limit = 70;

		if (name.length > limit) {
			name = name.substring(0, limit);
			name += '...';
			return name;
		} else {
			return name;
		}
	};

	return (
		<div className={styles.container}>
			<Head>
				<title>Simple launchpad</title>
				<meta name="description" content="Simple launchpad - upload your sounds and have fun!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.title}>
				<h1>Simple launchpad</h1>
			</div>
			<div className={styles.launchpadContainer}>
				<div className={styles.launchpad}>
					{buttons.map((btn) => (
						<div
							className={`${styles.button} ${btn.playing ? styles.playing : null}`}
							onClick={(e) => handleClick(btn.key, e)}
							key={btn.key}
						>
							<div className={styles.firstRow}>
								<div className={styles.key}>{btn.key}</div>
								<div className={styles.delete} id="delete-button-container" onClick={() => handleDelete(btn.key)}>
									<Image width={22} height={22} id="delete-button" src="/delete.svg" alt="delete" />
								</div>
							</div>
							<div className={styles.name}>{refactorName(btn.name)}</div>
						</div>
					))}
					<div className={styles.addNewButton} onClick={handleAddButtonDialog}></div>
				</div>
				{isAddingButtonDialog ? <AddButton cancel={handleCancel} addButtons={addButtons} /> : null}
			</div>
			<div className={styles.footer}>
				<div>Press specific key (or click button) to play a sound | Press Escape to pause</div>
				<div>Daniel Skowron - Simple launchpad &copy; 2022</div>
			</div>
		</div>
	);
}

export async function getServerSideProps() {
	return {
		props: {
			defaultButtons: [
				{ name: 'Clap', key: 'q', soundSrc: '/default_sounds/clap.wav', playing: false },
				{ name: 'HiHat', key: 'w', soundSrc: '/default_sounds/hihat.wav', playing: false },
				{ name: 'Kick', key: 'e', soundSrc: '/default_sounds/kick.wav', playing: false },
				{ name: 'Snare', key: 'r', soundSrc: '/default_sounds/snare.wav', playing: false },
			],
		},
	};
}
