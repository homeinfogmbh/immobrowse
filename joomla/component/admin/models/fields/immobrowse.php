<?php
// No direct access to this file
defined('_JEXEC') or die;

// import the list field type
jimport('joomla.form.helper');
JFormHelper::loadFieldClass('list');

/**
 * ImmoBrowse Form Field class for the ImmoBrowse component
 */
class JFormFieldImmoBrowse extends JFormFieldList
{
    /**
     * The field type.
     *
     * @var        string
     */
    protected $type = 'ImmoBrowse';

    /**
     * Method to get a list of options for a list input.
     *
     * @return    array        An array of JHtml options.
     */
    protected function getOptions()
    {
        $db = JFactory::getDBO();
        $query = $db->getQuery(true);
        $query->select('id, customer');
        $query->from('#__immobrowse');
        $db->setQuery((string)$query);
        $messages = $db->loadObjectList();
        $options = array();
        if ($messages)
        {
            foreach($messages as $message)
            {
                $options[] = JHtml::_('select.option', $message->id, $message->customer);
            }
        }
        $options = array_merge(parent::getOptions(), $options);
        return $options;
    }
}
?>
