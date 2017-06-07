<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla view library
jimport('joomla.application.component.view');

/**
 * Expose View class for the ImmoBrowse Component
 */
class ImmoBrowseViewExpose extends JView
{
    // Overwriting JView display method
    function display($tpl = null)
    {
        // Assign data to the view
        $this->customer = $this->get('Customer');
        $this->sitekey = $this->get('Sitekey');
        $this->hiseconcfg = $this->get('HiseconCfg');
        $this->objectId = $this->get('ObjectId');

        // Check for errors.
        if (count($errors = $this->get('Errors')))
        {
            JLog::add(implode('<br />', $errors), JLog::WARNING, 'jerror');
            return false;
        }
        // Display the view
        parent::display($tpl);
    }
}
?>
