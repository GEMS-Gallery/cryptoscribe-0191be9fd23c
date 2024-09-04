import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Button, TextField, Card, CardContent, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface Post {
  id: bigint;
  title: string;
  body: string;
  author: string;
  timestamp: bigint;
}

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const fetchedPosts = await backend.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await backend.createPost(title, body, author);
      if ('ok' in result) {
        setShowForm(false);
        setTitle('');
        setBody('');
        setAuthor('');
        await fetchPosts();
      } else {
        console.error('Error creating post:', result.err);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" className="py-8">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <Typography variant="h2" component="h1" gutterBottom>
          Crypto Blog
        </Typography>
        <Typography variant="h5">
          Share your thoughts on the world of cryptocurrency
        </Typography>
      </div>

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setShowForm(!showForm)}
        className="mb-4"
      >
        {showForm ? 'Cancel' : 'New Post'}
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8">
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-4"
          />
          <TextField
            label="Body"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="mb-4"
          />
          <TextField
            label="Author"
            variant="outlined"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="mb-4"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      )}

      {loading ? (
        <CircularProgress />
      ) : (
        posts.map((post) => (
          <Card key={Number(post.id)} className="mb-4">
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                {post.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                By {post.author} | {new Date(Number(post.timestamp) / 1000000).toLocaleString()}
              </Typography>
              <Typography variant="body1">{post.body}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
};

export default App;
