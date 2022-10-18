import React, { useState } from 'react';
import styles from '../styles/addButton.module.css';

export default function AddButton({ isAddingButtonDialog, addButtons }) {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [isFilePicked, setIsFilePicked] = useState(false);

	const [names, setNames] = useState([]);
	const [keys, setKeys] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();

		let buttons = [];

		for (let i = 0; i < selectedFiles.length; i++) {
			let tmpNewButton = {
				name: names[i],
				key: keys[i],
				soundSrc: URL.createObjectURL(selectedFiles[i]),
				sound: new Audio(URL.createObjectURL(selectedFiles[i])),
			};

			tmpNewButton.sound.volume = 0.7;

			buttons.push(tmpNewButton);
		}

		addButtons(buttons);
	};
	const handleFilesUpload = (e) => {
		setSelectedFiles([...e.target.files]);

		let names = [];
		let keys = [];
		for (let i = 0; i < e.target.files.length; i++) {
			names.push(e.target.files[i].name);
			keys.push('');
		}

		setNames(names);
		setKeys(keys);

		if (e.target.files.length > 0) {
			setIsFilePicked(true);
		} else {
			setIsFilePicked(false);
		}
	};
	const handleNameChange = (e, i) => {
		let tmp = [...names];
		tmp[i] = e.target.value;
		setNames([...tmp]);
	};
	const handleKeyChange = (e, i) => {
		let tmp = [...keys];
		tmp[i] = e.target.value;
		setKeys([...tmp]);
	};
	if (isAddingButtonDialog) {
		return (
			<div className={styles.background}>
				<div className={styles.dialog}>
					<h1>Add sound</h1>
					<form onSubmit={handleSubmit}>
						<label htmlFor="sound-input" className={styles.customFileUpload}>
							Upload file(s)
						</label>
						<input onChange={handleFilesUpload} type="file" name="sound" id="sound-input" required multiple />
						<div className={styles.filesContainer}>
							{isFilePicked
								? selectedFiles.map((file, i) => (
										<div key={file.name} className={styles.file}>
											<label htmlFor="name">Name:</label>
											<input
												value={names[i]}
												onChange={(e) => handleNameChange(e, i)}
												type="text"
												name="name"
												id="name"
											/>
											<label htmlFor="key">Key:</label>
											<input
												required
												value={keys[i]}
												onChange={(e) => handleKeyChange(e, i)}
												type="text"
												name="key"
												id="key"
											/>
											<div className={styles.hLine}></div>
										</div>
								  ))
								: null}
							{isFilePicked ? <input type="submit" value="Add" /> : null}
						</div>
					</form>
				</div>
			</div>
		);
	} else {
		return null;
	}
}
