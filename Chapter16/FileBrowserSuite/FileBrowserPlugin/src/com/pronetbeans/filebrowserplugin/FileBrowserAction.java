package com.pronetbeans.filebrowserplugin;

import java.awt.event.ActionEvent;
import javax.swing.AbstractAction;
import javax.swing.ImageIcon;
import org.openide.util.NbBundle;
import org.openide.util.Utilities;
import org.openide.windows.TopComponent;

/**
 * Action which shows FileBrowser component.
 */
public class FileBrowserAction extends AbstractAction {

    public FileBrowserAction() {
        super(NbBundle.getMessage(FileBrowserAction.class, "CTL_FileBrowserAction"));
//        putValue(SMALL_ICON, new ImageIcon(Utilities.loadImage(FileBrowserTopComponent.ICON_PATH, true)));
    }

    public void actionPerformed(ActionEvent evt) {
        TopComponent win = FileBrowserTopComponent.findInstance();
        win.open();
        win.requestActive();
    }
}
