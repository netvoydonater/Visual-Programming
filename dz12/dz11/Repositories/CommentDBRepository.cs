using dz11.Models;
using Microsoft.EntityFrameworkCore;

namespace dz11.Repositories
{
    public class CommentDBRepository : ICommentRepository
    {
        private readonly ConnectToDB _dbContext;

        public CommentDBRepository(ConnectToDB dbContext)
        {
            _dbContext = dbContext;
        }

        public void createComment(int postId, string name, string email, string body)
        {
            var comment = new Comment()
            {
                PostId = postId,
                Name = name,
                Email = email,
                Body = body
            };

            _dbContext.comments.Add(comment);
            _dbContext.SaveChanges();
        }

        public void deleteById(int id)
        {
            var table = _dbContext.comments.Find(id);
            if (table != null)
            {
                _dbContext.comments.Remove(table);
                _dbContext.SaveChanges();
            }
        }

        public IEnumerable<Comment> GetAllTables()
        {
            return _dbContext.comments.ToList();
        }

        public Comment GetCommentById(int id)
        {
            return _dbContext.comments.Find(id);
        }

        public void UpdateId(int id, int postId, string name, string email, string body)
        {
            var comment = _dbContext.comments.Find(id);
            if (comment != null)
            {
                comment.PostId = postId;
                comment.Name = name;
                comment.Email = email;
                comment.Body = body;
                _dbContext.SaveChanges();
            }
        }
    }
}
