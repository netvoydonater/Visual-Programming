namespace test.Models
{
    public class Table
    {
        private int _postId;
        private int _id;
        private string? _name;
        private string? _email;
        private string? _body;

        public int PostId { get => _postId; set => _postId = value; }
        public int Id { get => _id; set => _id = value; }
        public string? Name { get => _name; set => _name = value; }
        public string? Email { get => _email; set => _email = value; }
        public string? Body { get => _body; set => _body = value; }
    }
}
