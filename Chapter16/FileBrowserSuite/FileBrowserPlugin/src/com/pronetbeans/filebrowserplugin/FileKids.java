package com.pronetbeans.filebrowserplugin;

import java.io.File;
import org.openide.nodes.Children;
import org.openide.nodes.Node;

public final class FileKids extends Children.Keys<File> {

    File file;
    
    public FileKids(File file) {
        this.file = file;
    }

    @Override
    protected Node[] createNodes(File f) {
        FileNode n = new FileNode(f);
        return new Node[]{n};
    }

    @Override
    protected void addNotify() {
        if (file == null) {
            File[] arr = File.listRoots();
            if (arr.length == 1) {
                arr = arr[0].listFiles();
            }
            setKeys(arr);

        } else {
            File[] arr = file.listFiles();
            if (arr != null) {
                setKeys(arr);
            }
        }
    }
}
