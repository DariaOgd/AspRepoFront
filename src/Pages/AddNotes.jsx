import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../utils/newRequest";
import { useNavigate } from "react-router-dom";
import universities from '../data/universities';
import Navbar2 from '../Components/Navbar2';
import './AddNotes.scss';

const AddNotes = () => {
  const [title, setTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [university, setUniversity] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await newRequest.get('/Categories');
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (note) => {
      const payload = { ...note, categoryId, university };
      console.log('Payload being sent:', payload); 
      return newRequest.post('/Notes', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notes']);
      navigate('/');
      window.location.reload();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ title, noteBody, isPublic });
  };

  return (
    <div className="add-notes">
      <Navbar2></Navbar2>
      <div className="container" id="add-notes-cont">
        <h1>Add New Note</h1>
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
              rows="10" /* Optional to make it larger initially */
              required
            />
          </div>
          <div className="form-group form-group-inline">
            <label htmlFor="isPublic">Do you want your notes to be public?</label>
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="isPublic"
                name="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label htmlFor="isPublic" className="checkbox-label">Yes</label>
            </div>
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
          <button type="submit">Create Note</button>
        </form>
      </div>
    </div>
  );
};

export default AddNotes;

