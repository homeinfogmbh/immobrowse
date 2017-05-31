<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla modelitem library
jimport('joomla.application.component.modelitem');

/**
 * Customers Model
 */
class ImmoBrowseModelList extends JModelItem
{
    /**
     * Get the message
     * @param  int    The corresponding id of the message to be retrieved
     * @return string The message to be displayed to the user
     */
    public function getCid($id = 1)
    {
        return JRequest::getVar('cid');
    }
}
?>