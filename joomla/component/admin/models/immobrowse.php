<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');
// import the Joomla modellist library
jimport('joomla.application.component.modellist');

// import Joomla modelform library
jimport('joomla.application.component.modeladmin');

/**
 * ImmoBrowseList Model
 */
class ImmoBrowseModelImmoBrowse extends JModelList
{
    /**
     * Method to build an SQL query to load the list data.
     *
     * @return    string    An SQL query
     */
    protected function getListQuery()
    {
        // Create a new query object.
        $db = JFactory::getDBO();
        $query = $db->getQuery(true);
        // Select some fields
        $query->select('id, customer');
        // From the immobrowse table
        $query->from('#__immobrowse');
        return $query;
    }
    public function getTable($type = 'ImmoBrowse', $prefix = 'ImmoBrowseTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }
    /**
     * Method to get the record form.
     *
     * @param    array    $data        Data for the form.
     * @param    boolean    $loadData    True if the form is to load its own data (default case), false if not.
     * @return    mixed    A JForm object on success, false on failure
     * @since    2.5
     */
    public function getForm($data = array(), $loadData = true)
    {
        // Get the form.
        $form = $this->loadForm('com_immobrowse.immobrowse', 'immobrowse',
                                array('control' => 'jform', 'load_data' => $loadData));
        if (empty($form))
        {
            return false;
        }
        return $form;
    }
    /**
     * Method to get the data that should be injected in the form.
     *
     * @return    mixed    The data for the form.
     * @since    2.5
     */
    protected function loadFormData()
    {
        // Check the session for previously entered form data.
        $data = JFactory::getApplication()->getUserState('com_immobrowse.edit.immobrowse.data', array());
        if (empty($data))
        {
            $data = $this->getItem();
        }
        return $data;
    }
}
?>
