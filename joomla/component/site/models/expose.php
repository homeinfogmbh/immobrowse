<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla modelitem library
jimport('joomla.application.component.modelitem');

/**
 * Customers Model
 */
class ImmoBrowseModelExpose extends JModelItem
{
    /**
     * Get the message
     * @param  int    The corresponding id of the message to be retrieved
     * @return string The message to be displayed to the user
     */
    public function getCid()
    {
        return JRequest::getVar('cid');
    }

    public function getObjectId()
    {
        return JRequest::getVar('objectId');
    }
}
?>
