<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla controllerform library
jimport('joomla.application.component.controllerform');

// import Joomla controlleradmin library
jimport('joomla.application.component.controlleradmin');

/**
 * ImmoBrowse Controller
 */
class ImmoBrowseControllerImmoBrowse extends JControllerForm
{
    /**
     * Proxy for getModel.
     * @since    2.5
     */
    public function getModel($name = 'ImmoBrowse', $prefix = 'ImmoBrowseModel')
    {
        $model = parent::getModel($name, $prefix, array('ignore_request' => true));
        return $model;
    }
}
