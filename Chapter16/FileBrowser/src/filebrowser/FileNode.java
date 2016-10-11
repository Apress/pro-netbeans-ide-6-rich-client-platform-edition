package filebrowser;

import java.io.File;
import org.openide.nodes.AbstractNode;
import org.openide.nodes.Node;

public final class FileNode extends AbstractNode{

    public FileNode(File f) {
        super(new FileKids(f));
        setName(f.getName());
    }
    
    public static Node files() {
        AbstractNode n = new AbstractNode(new FileKids(null));
        n.setName("Root");
        return n;
    }
}
