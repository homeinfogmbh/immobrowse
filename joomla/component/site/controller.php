<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla controller library
jimport('joomla.application.component.controller');

/**
 * ImmoBrowse Component Controller
 */
class ImmoBrowseController extends JController
{
    /**
     * display task
     *
     * @return void
     */
    function display($cachable = false, $urlparams = false)
    {
        // set default view if not set
        $input = JFactory::getApplication()->input;

        if (JRequest::getVar('objectId') == null) {
            $input->set('view', $input->getCmd('view', 'List'));
        } else {
            $input->set('view', $input->getCmd('view', 'Expose'));
        }

        // call parent behavior
        parent::display($cachable);
    }
}
?>
