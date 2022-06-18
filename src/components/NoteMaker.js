import { useState, useEffect } from "react";
import "../styles/noteMaker.scss";
import "../styles/login.scss";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import urls from "../utils/urls";

const NoteMaker = ({ user, logout, setMessage }) => {
	const [notes, setNotes] = useState([]);
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [rawTags, setRawTags] = useState("");
	const [editingId, setEditingId] = useState(null);
	const [allTags, setAllTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	const flushInput = () => {
		setEditingId(null);
		setTitle("");
		setBody("");
		setRawTags("");
	};

	const stringToTags = () => {
		let splitTags = rawTags.split(","),
			tags = [];
		for (let i = 0; i < splitTags.length; ++i) {
			const trimmedTag = splitTags[i].trim();
			if (trimmedTag) tags.push(trimmedTag);
		}
		return tags;
	};

	const addNote = async () => {
		if (!title || !body || !rawTags)
			return setMessage("Fill all the fields");
		let response;
		try {
			response = await axios.post(
				urls.notes,
				{ title, body, tags: stringToTags() },
				{ withCredentials: true }
			);
			setMessage(response.data.body.message);
			if (response.data.success) {
				setNotes([...notes, response.data.body.note]);
				flushInput();
			}
		} catch (err) {
			setMessage(response.data.body.message);
		}
	};

	const initializeEdit = async (note) => {
		setEditingId(note._id);
		setTitle(note.title);
		setBody(note.body);
		setRawTags(note.tags.join(","));
	};

	const editNote = async () => {
		if (!title || !body || !rawTags)
			return setMessage("Fill all the fields");
		let response;
		try {
			response = await axios.put(
				`${urls.notes}/${editingId}`,
				{ title, body, tags: stringToTags() },
				{ withCredentials: true }
			);
			setMessage(response.data.body.message);
			if (response.data.success) {
				const _notes = notes.map((note) => {
					if (note._id === editingId) return response.data.body.note;
					return note;
				});
				setNotes([..._notes]);
				flushInput();
			}
		} catch (err) {
			setMessage(response.data.body.message);
		}
	};

	const deleteNote = async (_id) => {
		try {
			const response = await axios.delete(`${urls.notes}/${_id}`, {
				withCredentials: true,
			});
			setMessage(response.data.body.message);
			const _notes = notes.filter((note) => note._id !== _id);
			setNotes([..._notes]);
		} catch {}
	};

	const getNotes = async (tags = []) => {
		let _tags = {};
		for (let i = 0; i < tags.length; ++i) _tags[`tag${i + 1}`] = tags[i];
		try {
			const response = await axios.get(urls.notes, {
				withCredentials: true,
				params: _tags,
			});
			if (response.data.success) setNotes(response.data.body.notes);
		} catch {}
	};

	const toggleSelectedTag = (tag) => {
		if (selectedTags.includes(tag)) {
			const _selectedTags = selectedTags.filter((_tag) => _tag !== tag);
			setSelectedTags([..._selectedTags]);
		} else setSelectedTags([...selectedTags, tag]);
	};

	useEffect(() => {
		getNotes(selectedTags);
	}, [selectedTags]);

	useEffect(() => {
		if (!selectedTags.length) {
			const _allTags = new Set();
			notes.forEach((note) => {
				note.tags.forEach((tag) => _allTags.add(tag));
			});
			setAllTags(Array.from(_allTags));
		}
	}, [notes]);

	useEffect(() => {
		getNotes();
	}, []);

	return (
		<div className="note-maker-container">
			<header className="note-maker-header">
				<div className="username">
					<p>{user?.username}</p>
				</div>
				<div className="logout">
					<input type="button" value="LOG OUT" onClick={logout} />
				</div>
			</header>
			<div className="notes-container">
				<form className="form">
					<div className="heading">
						<h3>Add Note</h3>
					</div>
					<div className="input-field">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							value={title}
							name="title"
							onChange={({ target: { value } }) =>
								setTitle(value)
							}
						/>
					</div>
					<div className="input-field">
						<label htmlFor="body">Body</label>
						<textarea
							value={body}
							name="body"
							onChange={({ target: { value } }) => setBody(value)}
						/>
					</div>
					<div className="input-field">
						<label htmlFor="title">Tags</label>
						<input
							type="text"
							value={rawTags}
							name="rawTags"
							onChange={({ target: { value } }) =>
								setRawTags(value)
							}
						/>
						<p>Multiple tags can be separated by commas</p>
						<p>Enter atleast 2 tags</p>
					</div>
					<div className="submit-button">
						<input
							type="button"
							value={editingId ? "Edit" : "Add"}
							onClick={editingId ? editNote : addNote}
						/>
					</div>
				</form>
				{allTags.length && (
					<div className="tag-filter">
						<h5>Tags</h5>
						<div className="all-tags">
							{allTags.map((tag) => {
								return (
									<p
										key={tag}
										onClick={() => toggleSelectedTag(tag)}
										className={
											selectedTags.includes(tag)
												? "selected-tag"
												: "tag"
										}
									>
										{tag}
									</p>
								);
							})}
						</div>
					</div>
				)}
				{!notes.length && <p style={{textAlign: 'center', color: '#FFF'}}>No notes to show</p>} 
				<ul className="notes">
					{notes.map((note) => {
						return (
							<li key={note._id} className="note">
								<div className="note-heading">
									<strong className="note-title">
										{note.title}
									</strong>
									<div className="note-actions">
										<FaEdit
											style={{ color: "mediumblue" }}
											onClick={() => initializeEdit(note)}
										/>
										<FaTrash
											style={{ color: "red" }}
											onClick={() => deleteNote(note._id)}
										/>
									</div>
								</div>
								<pre>{note.body}</pre>
								<div className="note-tags">
									{note.tags.map((tag) => {
										return (
											<div key={tag} className="tag">
												{tag}
											</div>
										);
									})}
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};

export default NoteMaker;
