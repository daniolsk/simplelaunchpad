import React, { useState } from 'react';
import styles from '../styles/addButton.module.css';

export default function addButton({ isAddingButtonDialog }) {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [isFilePicked, setIsFilePicked] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
	};
	const handleFilesUpload = (e) => {
		setSelectedFiles([...e.target.files]);
		if (e.target.files.length > 0) {
			setIsFilePicked(true);
		} else {
			setIsFilePicked(false);
		}
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
								? selectedFiles.map((file) => (
										<div key={file.name} className={styles.file}>
											<label htmlFor="name">Name:</label>
											<input value={file.name} type="text" name="name" id="name" />
											<label htmlFor="key">Key:</label>
											<input type="text" name="key" id="key" />
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
