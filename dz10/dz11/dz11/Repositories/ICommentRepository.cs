using dz11.Models;
namespace dz11.Repositories
{
    public interface ICommentRepository
    {
        void createComment(int postId, string name, string email, string body);
        void UpdateId(int id, int postId, string name, string email, string body);
        void deleteById(int id);
        Comment GetCommentById(int id);
        IEnumerable<Comment> GetAllTables();
    }
}
