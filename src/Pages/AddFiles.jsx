import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from '../utils/newRequest';
import { useNavigate } from 'react-router-dom';
import universities from '../data/universities';
import './AddFiles.scss';

const AddFiles = () => {
  const [file, setFile] = useState(null);
  const [university, setUniversity] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [uploading, setUploading] = useState(false);
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
    mutationFn: async (fileData) => {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('university', fileData.university);
      formData.append('title', fileData.title);
      formData.append('categoryId', fileData.categoryId);
      return newRequest.post('/Files', formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['files']);
      navigate('/');
    },
  });

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      console.error('Please select a file.');
      return;
    }

    setUploading(true);

    mutation.mutate({ file, university, title, categoryId });
    setUploading(false);
  };

  return (
    <div className="add-files">
      <div className="container">
        <h1>Add New File</h1>
        {isLoadingCategories && <p>Loading categories...</p>}
        {categoriesError && <p>Error loading categories</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="file">Upload File</label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
              required
            />
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
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="File title"
              required
            />
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
          <button type="submit" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFiles;
