<?php
// No direct access to this file
defined('_JEXEC') or die('Restricted access');

// import Joomla modelitem library
jimport('joomla.application.component.modelitem');

/**
 * Customers Model
 */
class ImmoBrowseModelCustomers extends JModelItem
{
    /**
     * @var string msg
     */
    protected $customers;

    /**
     * Returns a reference to the a Table object, always creating it.
     *
     * @param    type    The table type to instantiate
     * @param    string    A prefix for the table class name. Optional.
     * @param    array    Configuration array for model. Optional.
     * @return    JTable    A database object
     * @since    2.5
     */
    public function getTable($type = 'ImmoBrowse', $prefix = 'ImmoBrowseTable', $config = array())
    {
        return JTable::getInstance($type, $prefix, $config);
    }

    /**
     * Get the message
     * @param  int    The corresponding id of the message to be retrieved
     * @return string The message to be displayed to the user
     */
    public function getCid($id = 1)
    {
        if (!is_array($this->customers))
        {
            $this->customers = array();
        }

        if (!isset($this->customers[$id]))
        {
                        //request the selected id
            $jinput = JFactory::getApplication()->input;
            $id = $jinput->get('id', 1, 'INT' );

            // Get a TableImmoBrowse instance
            $table = $this->getTable();

            // Load the message
            $table->load($id);

            // Assign the message
            $this->customers[$id] = $table->customer;
        }

        return $this->customers[$id];
    }
}
?>
