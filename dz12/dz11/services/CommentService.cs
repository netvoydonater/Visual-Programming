using dz11.Models;
using dz11.Repositories;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace dz11.services
{
    public class CommentService
    {
        ICommentRepository Cr;

        public CommentService(ICommentRepository iTableCommand) => this.Cr = iTableCommand;

        public void AddTable(Comment comment) => Cr.createComment(comment.PostId, comment.Name, comment.Email, comment.Body);

        public Comment GetTable(int id) => Cr.GetCommentById(id);

        public IEnumerable<Comment> GetTableAll() => Cr.GetAllTables();

        public void delete(int id) => Cr.deleteById(id);

        public void update(int id, Comment comment) => Cr.UpdateId(id, comment.PostId, comment.Name, comment.Email, comment.Body);
    }
}
