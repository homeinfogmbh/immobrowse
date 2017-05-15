<?php
// Restrict direct access
defined('_JEXEC') or die('Restricted access');

// Include dependencies
jimport('joomla.application.component.controller');

$objektnr_extern = JRequest::getVar('objektnr_extern', null);

if ($objektnr_extern == null) {
    // List mode
    echo 'Admin List mode';
} else {
    // Expose mode
    echo 'Admin Exposé mode';
}
?>
