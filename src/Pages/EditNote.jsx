import React, { useState, useEffect } from 'react';
import newRequest from '../utils/newRequest';
import { useParams, useNavigate } from 'react-router-dom';
import universities from '../data/universities';
import { useQuery } from "@tanstack/react-query";
import './EditNote.scss';

const EditNote = () => {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [university, setUniversity] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await newRequest.get('/Categories');
      return response.data;
    },
  });

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await newRequest.get(`/Notes/${id}`);
        setNote(response.data);
        setTitle(response.data.title);
        setNoteBody(response.data.noteBody);
        setUniversity(response.data.university);
        setCategoryId(response.data.categoryId);
        setIsPublic(response.data.isPublic);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const updatedNote = {
      title,
      noteBody,
      university,
      categoryId,
      isPublic
    };

    try {
      const response = await newRequest.put(`/Notes/${id}`, updatedNote);
      console.log('Note updated successfully:', response.data);
      navigate(`/usernotes/${note.userId}`); // Navigate after successful submission
    } catch (error) {
      console.error('Error updating note:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="edit-note">
      <div className="container">
        <h1>Edit Note</h1>
        {isLoadingCategories && <p>Loading categories...</p>}
        {categoriesError && <p>Error loading categories</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="noteBody">Note Body</label>
            <textarea
              id="noteBody"
              name="noteBody"
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Enter your note here"
              rows="10"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="isPublic">Is Public?</label>
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <label htmlFor="isPublic">Yes</label>
          </div>
          <div className="form-group">
            <label htmlFor="university">University</label>
            <select
              id="university"
              name="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            >
              <option value="">Select a university</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.name}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories && categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Note'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditNote;
