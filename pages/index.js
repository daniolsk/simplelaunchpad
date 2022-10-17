import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import AddButton from '../components/addButton';

export default function Home({ defaultButtons }) {
	const [buttons, setButtons] = useState(defaultButtons);
	const [isAddingButtonDialog, setIsAddingButtonDialog] = useState(false);

	useEffect(() => {
		let tmpButtons = buttons;

		tmpButtons.forEach((btn) => {
			btn.sound = new Audio(btn.soundSrc);
			btn.sound.volume = 0.7;
		});

		setButtons(tmpButtons);

		const handleKeyDown = (e) => {
			let key = e.key;

			buttons.forEach((btn) => {
				if (btn.key == key) {
					btn.sound.currentTime = 0;
					btn.sound.play();
				}
			});
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleClick = (key) => {
		buttons.forEach((btn) => {
			if (btn.key == key) {
				btn.sound.currentTime = 0;
				btn.sound.play();
			}
		});
	};

	const handleAddButtonDialog = () => {
		setIsAddingButtonDialog(true);
	};

	const addButtons = (newButtons) => {
		setButtons([...buttons, ...newButtons]);

		setIsAddingButtonDialog(false);
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
						<div className={styles.button} onClick={() => handleClick(btn.key)} key={btn.key}>
							<div className={styles.firstRow}>
								<div className={styles.key}>{btn.key}</div>
								<div className={styles.delete}>X</div>
							</div>
							<div className={styles.name}>{btn.name}</div>
						</div>
					))}
					<div className={styles.addNewButton} onClick={handleAddButtonDialog}></div>
				</div>
			</div>
			<AddButton isAddingButtonDialog={isAddingButtonDialog} addButtons={addButtons} />
		</div>
	);
}

export async function getServerSideProps(context) {
	return {
		props: {
			defaultButtons: [
				{ name: 'Clap', key: 'q', soundSrc: '/default_sounds/clap.wav' },
				{ name: 'HiHat', key: 'w', soundSrc: '/default_sounds/hihat.wav' },
				{ name: 'Kick', key: 'e', soundSrc: '/default_sounds/kick.wav' },
				{ name: 'Snare', key: 'r', soundSrc: '/default_sounds/snare.wav' },
			],
		},
	};
}
